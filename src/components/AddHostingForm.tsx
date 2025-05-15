import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createHosting } from "@/services/hosting";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { uploadImage, getPlaceholderImage } from "@/utils/fileUpload";
import { X, Upload } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const days = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
];

const timeSlots = [
  { id: "breakfast", label: "Breakfast (8AM - 10AM)" },
  { id: "lunch", label: "Lunch (12PM - 2PM)" },
  { id: "dinner", label: "Dinner (6PM - 8PM)" },
];

const hostingSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").optional(),
  location: z.string().min(5, "Location must be at least 5 characters"),
  available_days: z.array(z.string()).min(1, "Select at least one day"),
  time_slots: z.array(z.string()).min(1, "Select at least one time slot"),
  max_guests: z.coerce.number().int().positive("Number of guests must be positive"),
  price_per_guest: z.coerce.number().positive("Price must be positive"),
  image_url: z.string().optional(),
});

type HostingFormValues = z.infer<typeof hostingSchema>;

interface AddHostingFormProps {
  onSuccess: () => void;
}

const AddHostingForm = ({ onSuccess }: AddHostingFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<HostingFormValues>({
    resolver: zodResolver(hostingSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      available_days: [],
      time_slots: [],
      max_guests: 4,
      price_per_guest: 0,
      image_url: "",
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);
    
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setUploadError("Please select a JPG, JPEG, or PNG file.");
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("File is too large. Maximum size is 5MB.");
        return;
      }
      
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      try {
        setIsUploading(true);
        const { url, error } = await uploadImage(file, 'hostings');
        
        if (error) {
          toast({
            title: "Upload Failed",
            description: error,
            variant: "destructive",
          });
          setIsSubmitting(false);
          setIsUploading(false);
          e.target.value = "";
          return;
        }
        
        if (url) {
          form.setValue("image_url", url);
          toast({
            title: "Image Uploaded",
            description: "Your hosting image has been uploaded.",
          });
        }
      } catch (error) {
        console.error("Failed to upload image:", error);
        toast({
          title: "Error",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
        setIsUploading(false);
      }
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    form.setValue("image_url", "");
  };

  const onSubmit = async (data: HostingFormValues) => {
    try {
      setIsSubmitting(true);

      // Use the image_url already set by handleImageChange
      const imageUrl = data.image_url || "";

      await createHosting({
        title: data.title,
        description: data.description || "",
        location: data.location,
        available_days: data.available_days,
        time_slots: data.time_slots,
        max_guests: data.max_guests,
        price_per_guest: data.price_per_guest,
        image_url: imageUrl,
      });

      toast({
        title: "Success",
        description: "Hosting created successfully!",
      });

      // Reset form and state
      form.reset();
      setSelectedImage(null);
      setImagePreview(null);
      onSuccess();
    } catch (error) {
      console.error("Failed to create hosting:", error);
      toast({
        title: "Error",
        description: "Failed to create hosting. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter hosting title" {...field} />
              </FormControl>
              <FormDescription>
                A catchy title for your hosting event
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your hosting experience" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Tell customers what to expect from your hosting
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter the location" {...field} />
              </FormControl>
              <FormDescription>
                Where will you be hosting your guests?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Hosting Image</FormLabel>
          <div className="space-y-4">
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <FormLabel htmlFor="hosting-image" className="cursor-pointer text-center">
                    <span className="text-primary font-medium">Click to upload</span>
                    <span className="text-gray-500"> or drag and drop</span>
                  </FormLabel>
                  <FormDescription className="text-xs text-center">
                    Upload an image of your hosting venue or atmosphere (JPG, JPEG, or PNG, max 5MB)
                  </FormDescription>
                  <Input 
                    id="hosting-image"
                    type="file" 
                    className="hidden" 
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleImageChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('hosting-image')?.click()}
                  >
                    Select File
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden border border-gray-200">
                <AspectRatio ratio={16 / 9} className="bg-gray-100">
                  <img
                    src={imagePreview}
                    alt="Hosting venue preview"
                    className="object-cover w-full h-full"
                  />
                </AspectRatio>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/50"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            {uploadError && (
              <p className="text-sm font-medium text-destructive">{uploadError}</p>
            )}
          </div>
        </FormItem>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="max_guests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Guests</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1"
                    placeholder="4" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  How many guests can you accommodate?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="price_per_guest"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price per Guest ($)</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  How much will you charge per guest?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="available_days"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Available Days</FormLabel>
                <FormDescription>
                  Select the days when you're available to host
                </FormDescription>
              </div>
              <Card>
                <CardContent className="pt-4">
                  {days.map((day) => (
                    <FormField
                      key={day.id}
                      control={form.control}
                      name="available_days"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={day.id}
                            className="flex flex-row items-start space-x-3 space-y-0 py-1"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(day.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, day.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== day.id
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {day.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </CardContent>
              </Card>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="time_slots"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Time Slots</FormLabel>
                <FormDescription>
                  Select the time slots when you're available
                </FormDescription>
              </div>
              <Card>
                <CardContent className="pt-4">
                  {timeSlots.map((slot) => (
                    <FormField
                      key={slot.id}
                      control={form.control}
                      name="time_slots"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={slot.id}
                            className="flex flex-row items-start space-x-3 space-y-0 py-1"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(slot.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, slot.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== slot.id
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {slot.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </CardContent>
              </Card>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting || isUploading}
        >
          {isSubmitting ? (isUploading ? "Uploading Image..." : "Creating Hosting...") : "Create Hosting"}
        </Button>
      </form>
    </Form>
  );
};

export default AddHostingForm;
