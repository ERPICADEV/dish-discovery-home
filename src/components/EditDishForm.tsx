import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateDish, Dish } from "@/services/dishes";
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
  image_url: z.string().url("Must be a valid URL").or(z.literal("")),
  cuisine_type: z.string().min(1, "Please select a cuisine type"),
});

type DishFormValues = z.infer<typeof dishSchema>;

interface EditDishFormProps {
  dish: Dish;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditDishForm = ({ dish, onSuccess, onCancel }: EditDishFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<DishFormValues>({
    resolver: zodResolver(dishSchema),
    defaultValues: {
      title: dish.title,
      description: dish.description,
      price: dish.price,
      image_url: dish.image_url,
      cuisine_type: dish.cuisine_type,
    },
  });

  const onSubmit = async (data: DishFormValues) => {
    try {
      setIsSubmitting(true);
      await updateDish(dish.id, {
        title: data.title,
        description: data.description,
        price: data.price,
        image_url: data.image_url,
        cuisine_type: data.cuisine_type,
      });
      toast({
        title: "Success",
        description: "Dish updated successfully!",
      });
      onSuccess();
    } catch (error) {
      console.error("Failed to update dish:", error);
      toast({
        title: "Error",
        description: "Failed to update dish. Please try again.",
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
              <FormMessage />
            </FormItem>
          )}
        />

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

        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://example.com/image.jpg" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Provide a URL to an image of your dish (optional but recommended)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
            {isSubmitting ? "Updating..." : "Update Dish"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditDishForm; 