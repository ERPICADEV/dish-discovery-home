import React from "react";
import { Hosting } from "@/services/hosting";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";

// Schema for booking form
const bookingSchema = z.object({
  seats: z.number()
    .min(1, "You must book at least 1 seat")
    .max(100, "Too many seats"),
  booking_date: z.string().min(1, "Please select a date"),
  time_slot: z.string().min(1, "Please select a time slot"),
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
      booking_date: "",
      time_slot: "",
    }
  });

  if (!selectedHosting) return null;

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Hosting Details Display */}
        {/* This section is removed to prevent duplicate rendering */}
        {/*
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>{selectedHosting.title}</CardTitle>
            <CardDescription>{selectedHosting.location}</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedHosting.image_url && (
              <div className="w-full mb-4 rounded-md overflow-hidden">
                 <AspectRatio ratio={16 / 9}>
                   <img
                     src={selectedHosting.image_url}
                     alt={selectedHosting.title}
                     className="object-cover w-full h-full"
                   />
                 </AspectRatio>
              </div>
            )}
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{selectedHosting.description}</p>
            <div className="flex justify-between text-sm font-medium mb-2">
              <span>Price per guest:</span>
              <span>${selectedHosting.price_per_guest.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-medium mb-2">
              <span>Max guests:</span>
              <span>{selectedHosting.max_guests}</span>
            </div>
             <div className="mt-4">
              <h4 className="font-medium mb-2 text-sm">Available days:</h4>
              <div className="flex flex-wrap gap-1">
                {selectedHosting.available_days.map((day) => (
                  <Badge key={day} variant="secondary">{day}</Badge>
                ))}
              </div>
            </div>
             <div className="mt-2">
              <h4 className="font-medium mb-2 text-sm">Available time slots:</h4>
              <div className="flex flex-wrap gap-1">
                {selectedHosting.time_slots.map((slot) => (
                  <Badge key={slot} variant="secondary">{slot}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        */}
        
        {/* Booking Form Fields */}
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
        <FormField
          control={form.control}
          name="booking_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  min={today}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="time_slot"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Slot</FormLabel>
              <FormControl>
                <select {...field} className="w-full border rounded px-3 py-2 bg-background">
                  <option value="">Select a time slot</option>
                  {selectedHosting?.time_slots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
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
