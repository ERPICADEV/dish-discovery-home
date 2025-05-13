import React from "react";
import { Hosting } from "@/services/hosting";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Schema for booking form
const bookingSchema = z.object({
  seats: z.number()
    .min(1, "You must book at least 1 seat")
    .max(100, "Too many seats"),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  selectedHosting: Hosting | null;
  onSubmit: (data: BookingFormData) => Promise<void>;
  onCancel: () => void;
}

export const BookingForm = ({ selectedHosting, onSubmit, onCancel }: BookingFormProps) => {
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      seats: 2,
    }
  });

  if (!selectedHosting) return null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="seats"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Seats</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min={1} 
                  max={selectedHosting?.max_guests || 10}
                  {...field}
                  onChange={e => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit">Confirm Booking</Button>
        </div>
      </form>
    </Form>
  );
};
