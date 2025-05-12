
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
  available: z.boolean().default(true),
});

type DishFormValues = z.infer<typeof dishSchema>;

interface AddDishFormProps {
  onSuccess: () => void;
}

const AddDishForm = ({ onSuccess }: AddDishFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const onSubmit = async (data: DishFormValues) => {
    try {
      setIsSubmitting(true);
      // Ensure all required fields are present with proper types
      await addDish({
        title: data.title,
        description: data.description,
        price: data.price,
        image_url: data.image_url,
        cuisine_type: data.cuisine_type,
        available: data.available,
      });
      toast({
        title: "Success",
        description: "Dish added successfully!",
      });
      form.reset();
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
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding Dish..." : "Add Dish"}
        </Button>
      </form>
    </Form>
  );
};

export default AddDishForm;
