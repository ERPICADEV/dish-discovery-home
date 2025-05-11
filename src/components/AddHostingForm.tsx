
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
});

type HostingFormValues = z.infer<typeof hostingSchema>;

interface AddHostingFormProps {
  onSuccess: () => void;
}

const AddHostingForm = ({ onSuccess }: AddHostingFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    },
  });

  const onSubmit = async (data: HostingFormValues) => {
    try {
      setIsSubmitting(true);
      await createHosting(data);
      toast({
        title: "Success",
        description: "Hosting created successfully!",
      });
      form.reset();
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
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Hosting..." : "Create Hosting"}
        </Button>
      </form>
    </Form>
  );
};

export default AddHostingForm;
