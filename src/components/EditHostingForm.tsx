import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateHosting, Hosting } from "@/services/hosting";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const timeSlots = [
  "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"
];

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  available_days: z.array(z.string()).min(1, "At least one day must be selected"),
  time_slots: z.array(z.string()).min(1, "At least one time slot must be selected"),
  max_guests: z.coerce.number().positive("Max guests must be positive"),
  price_per_guest: z.coerce.number().positive("Price must be positive"),
  image_url: z.string().optional(),
  available: z.boolean()
});

type HostingFormValues = z.infer<typeof formSchema>;

interface EditHostingFormProps {
  hosting: Hosting;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditHostingForm = ({ hosting, onSuccess, onCancel }: EditHostingFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<HostingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: hosting.title,
      description: hosting.description || "",
      location: hosting.location,
      available_days: hosting.available_days,
      time_slots: hosting.time_slots,
      max_guests: hosting.max_guests,
      price_per_guest: hosting.price_per_guest,
      image_url: hosting.image_url,
      available: hosting.available,
    },
  });

  const onSubmit = async (data: HostingFormValues) => {
    try {
      setIsSubmitting(true);
      await updateHosting(hosting.id, {
        title: data.title,
        description: data.description,
        location: data.location,
        available_days: data.available_days,
        time_slots: data.time_slots,
        max_guests: data.max_guests,
        price_per_guest: data.price_per_guest,
        image_url: data.image_url,
        available: data.available,
      });
      toast({
        title: "Success",
        description: "Hosting updated successfully!",
      });
      onSuccess();
    } catch (error) {
      console.error("Failed to update hosting:", error);
      toast({
        title: "Error",
        description: "Failed to update hosting. Please try again.",
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
              <FormLabel>Hosting Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter title for your culinary event" {...field} />
              </FormControl>
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
                  placeholder="Describe your culinary event" 
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Share details about the experience, menu, and what guests can expect
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
                <Input placeholder="Enter the venue address" {...field} />
              </FormControl>
              <FormDescription>
                Provide the full address where your event will take place
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="available_days"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Available Days</FormLabel>
                <FormDescription>
                  Select the days when your event will be available
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {daysOfWeek.map((day) => (
                  <FormField
                    key={day}
                    control={form.control}
                    name="available_days"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={day}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(day)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, day])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== day
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {day}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
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
                <FormLabel>Available Time Slots</FormLabel>
                <FormDescription>
                  Select the time slots when your event will be available
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {timeSlots.map((slot) => (
                  <FormField
                    key={slot}
                    control={form.control}
                    name="time_slots"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={slot}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(slot)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, slot])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== slot
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {slot}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

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
                    placeholder="10" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Maximum number of guests you can accommodate
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
                    placeholder="25.00" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="available"
            checked={form.watch("available")}
            onCheckedChange={(checked) => form.setValue("available", checked as boolean)}
          />
          <label
            htmlFor="available"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Available for booking
          </label>
        </div>

        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Hosting"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditHostingForm;
