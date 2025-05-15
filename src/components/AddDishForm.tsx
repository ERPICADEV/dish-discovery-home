import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDish } from "@/services/dishes";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uploadImage, getPlaceholderImage } from "@/utils/fileUpload";
import { X, Upload } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const cuisineTypes = [
  "Italian",
  "Mexican",
  "Chinese",
  "Indian",
  "Japanese",
  "Thai",
  "American",
  "French",
  "Mediterranean",
  "Middle Eastern",
  "Korean",
  "Vietnamese",
  "Greek",
  "Spanish",
  "Caribbean",
  "Other",
];

const dishSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  image_url: z.string().optional(),
  cuisine_type: z.string().min(1, "Please select a cuisine type"),
  available: z.boolean().default(true),
});

type DishFormValues = z.infer<typeof dishSchema>;

interface AddDishFormProps {
  onSuccess: () => void;
}

const AddDishForm = ({ onSuccess }: AddDishFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [supabaseConfigured] = useState(
    !!import.meta.env.VITE_SUPABASE_URL && 
    !!import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  const form = useForm<DishFormValues>({
    resolver: zodResolver(dishSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      image_url: "",
      cuisine_type: "",
      available: true,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);
    
    if (!supabaseConfigured) {
      setUploadError("Supabase storage not configured. Image uploads are disabled.");
      return;
    }
    
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
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    form.setValue("image_url", "");
  };

  const onSubmit = async (data: DishFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Upload image if selected
      let imageUrl = data.image_url || "";
      
      if (selectedImage) {
        if (!supabaseConfigured) {
          // Use placeholder image if Supabase is not configured
          imageUrl = getPlaceholderImage();
        } else {
          setIsUploading(true);
          const uploadResult = await uploadImage(selectedImage, 'dishes');
          
          if (uploadResult.error) {
            toast({
              title: "Upload Failed",
              description: uploadResult.error,
              variant: "destructive",
            });
            setIsSubmitting(false);
            setIsUploading(false);
            return;
          }
          
          if (uploadResult.url) {
            imageUrl = uploadResult.url;
          }
          setIsUploading(false);
        }
      }
      
      // Ensure all required fields are present with proper types
      await addDish({
        title: data.title,
        description: data.description,
        price: data.price,
        image_url: imageUrl,
        cuisine_type: data.cuisine_type,
        available: data.available,
      });
      
      toast({
        title: "Success",
        description: "Dish added successfully!",
      });
      
      // Reset form and state
      form.reset();
      setSelectedImage(null);
      setImagePreview(null);
      onSuccess();
    } catch (error) {
      console.error("Failed to add dish:", error);
      toast({
        title: "Error",
        description: "Failed to add dish. Please try again.",
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
              <FormLabel>Dish Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter dish name" {...field} />
              </FormControl>
              <FormDescription>
                The name of your dish as it will appear to customers.
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
                  placeholder="Describe your dish, including ingredients and preparation style" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                A detailed description helps customers understand what to expect.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price per serving ($)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0.01" 
                    step="0.01" 
                    placeholder="0.00" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cuisine_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cuisine Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a cuisine type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {cuisineTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormItem>
          <FormLabel>Dish Image</FormLabel>
          <div className="space-y-4">
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <FormLabel htmlFor="dish-image" className="cursor-pointer text-center">
                    <span className="text-primary font-medium">Click to upload</span>
                    <span className="text-gray-500"> or drag and drop</span>
                  </FormLabel>
                  <FormDescription className="text-xs text-center">
                    JPG, JPEG, or PNG (max 5MB)
                  </FormDescription>
                  <Input 
                    id="dish-image"
                    type="file" 
                    className="hidden" 
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleImageChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('dish-image')?.click()}
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
                    alt="Dish preview"
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

        <FormField
          control={form.control}
          name="available"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Available</FormLabel>
                <FormDescription>
                  Toggle whether this dish is currently available for ordering
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting || isUploading}
        >
          {isSubmitting ? (isUploading ? "Uploading Image..." : "Adding Dish...") : "Add Dish"}
        </Button>
      </form>
    </Form>
  );
};

export default AddDishForm;
