
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDishById, Dish } from "@/services/dishes";
import { createOrder } from "@/services/orders";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const orderFormSchema = z.object({
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  delivery_address: z.string().min(10, "Address must be at least 10 characters"),
  special_instructions: z.string().optional(),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

const OrderDish = () => {
  const { dishId } = useParams<{ dishId: string }>();
  const [dish, setDish] = useState<Dish | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isCustomer, user } = useAuth();
  const navigate = useNavigate();

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      quantity: 1,
      delivery_address: "",
      special_instructions: "",
    },
  });

  // Update delivery address if user metadata is available
  useEffect(() => {
    if (user?.user_metadata) {
      // TypeScript doesn't know about address property, so we access it safely
      const userAddress = (user.user_metadata as any).address || "";
      form.setValue("delivery_address", userAddress);
    }
  }, [user, form]);

  useEffect(() => {
    const fetchDish = async () => {
      if (!dishId) return;
      
      try {
        setIsLoading(true);
        const dishData = await getDishById(dishId);
        setDish(dishData);
      } catch (error) {
        console.error("Failed to fetch dish:", error);
        toast({
          title: "Error",
          description: "Failed to load dish information.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDish();
  }, [dishId]);

  const onSubmit = async (data: OrderFormValues) => {
    if (!dish) return;
    
    try {
      setIsSubmitting(true);
      
      await createOrder({
        dish_id: dish.id,
        quantity: data.quantity,
        delivery_address: data.delivery_address,
        special_instructions: data.special_instructions,
      });
      
      toast({
        title: "Success",
        description: "Your order has been placed successfully!",
      });
      
      navigate("/orders");
    } catch (error) {
      console.error("Failed to place order:", error);
      toast({
        title: "Error",
        description: "Failed to place your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isCustomer) {
    return (
      <div className="container-custom py-16">
        <h1 className="text-3xl font-bold mb-6">Order Dish</h1>
        <p>You must be logged in as a customer to order dishes.</p>
        <Button className="mt-4" onClick={() => navigate("/login")}>Login</Button>
      </div>
    );
  }

  return (
    <div className="container-custom py-16">
      <Button 
        variant="outline" 
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        Back to Browse
      </Button>
      
      <h1 className="text-3xl font-bold mb-6">Place an Order</h1>
      
      {isLoading ? (
        <div className="flex justify-center">
          <p>Loading dish details...</p>
        </div>
      ) : dish ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Dish Information */}
          <Card>
            <CardHeader>
              <CardTitle>{dish.title}</CardTitle>
              <CardDescription>Cuisine: {dish.cuisine_type}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-60 rounded-md overflow-hidden">
                <img 
                  src={dish.image_url || "/placeholder.svg"} 
                  alt={dish.title} 
                  className="h-full w-full object-cover"
                />
              </div>
              <p>{dish.description}</p>
              <div className="text-xl font-semibold">${dish.price.toFixed(2)}</div>
            </CardContent>
          </Card>

          {/* Order Form */}
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
              <CardDescription>Please provide your order information</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1"
                            {...field}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (value > 0) {
                                field.onChange(value);
                              }
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          How many servings do you want?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="delivery_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full address" {...field} />
                        </FormControl>
                        <FormDescription>
                          Where should the order be delivered?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="special_instructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Instructions (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any special requests or dietary concerns?"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span>Price per serving:</span>
                      <span>${dish.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Quantity:</span>
                      <span>{form.watch("quantity") || 1}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>${((form.watch("quantity") || 1) * dish.price).toFixed(2)}</span>
                    </div>
                  </div>

                  <CardFooter className="flex justify-end px-0">
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? "Placing Order..." : "Place Order"}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Dish not found</h2>
          <p className="text-gray-600 mb-6">
            The dish you're looking for doesn't exist or may have been removed.
          </p>
          <Button onClick={() => navigate("/browse")}>Browse Dishes</Button>
        </div>
      )}
    </div>
  );
};

export default OrderDish;
