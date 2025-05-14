import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDishById, Dish } from "@/services/dishes";
import { createOrder } from "@/services/orders";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import LoginRequiredPrompt from "@/components/LoginRequiredPrompt";

const orderFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  notes: z.string().optional(),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

const OrderDish = () => {
  const { dishId } = useParams<{ dishId: string }>();
  const [dish, setDish] = useState<Dish | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isLoggedIn, isCustomer, isChef, user } = useAuth();
  const navigate = useNavigate();

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      name: user?.user_metadata?.name || "",
      email: user?.email || "",
      phone: user?.user_metadata?.phone || "",
      address: user?.user_metadata?.location || "",
      notes: "",
    },
  });

  useEffect(() => {
    if (!dishId) return;

    const loadDish = async () => {
      try {
        setIsLoading(true);
        const dishData = await getDishById(dishId);
        setDish(dishData);
      } catch (error) {
        console.error("Error loading dish:", error);
        toast({
          title: "Error",
          description: "Failed to load dish details. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDish();
  }, [dishId]);

  const onSubmit = async (values: OrderFormValues) => {
    if (!dishId) return;

    setIsSubmitting(true);
    try {
      const response = await createOrder({
        dish_id: dishId,
        customer_id: user?.id || "",
        customer_name: values.name,
        customer_email: values.email,
        customer_phone: values.phone,
        delivery_address: values.address,
        notes: values.notes,
      });

      if (response.message === "Order created successfully") {
        toast({
          title: "Success",
          description: "Your order has been placed successfully!",
        });
        navigate("/orders");
      } else {
        toast({
          title: "Error",
          description: "Failed to create order. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Order creation error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container-custom py-16">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
          <p className="mt-4">Loading dish details...</p>
        </div>
      </div>
    );
  }

  if (!dish) {
    return (
      <div className="container-custom py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Dish Not Found</h1>
          <p className="mb-8">Sorry, we couldn't find the dish you're looking for.</p>
          <Button onClick={() => navigate("/browse")}>Back to Browse</Button>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="container-custom py-16">
        <Button
          variant="outline"
          className="mb-8"
          onClick={() => navigate("/browse")}
        >
          Back to Browse
        </Button>
        
        <LoginRequiredPrompt 
          message="You must log in to place an order" 
          returnPath="/browse"
        />
      </div>
    );
  }

  if (isChef) {
    return (
      <div className="container-custom py-16">
        <Button
          variant="outline"
          className="mb-8"
          onClick={() => navigate("/browse")}
        >
          Back to Browse
        </Button>
        
        <LoginRequiredPrompt 
          message="Please log in as a customer to place an order" 
          returnPath="/browse"
        />
      </div>
    );
  }

  return (
    <div className="container-custom py-16">
      <Button
        variant="outline"
        className="mb-8"
        onClick={() => navigate("/browse")}
      >
        Back to Browse
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{dish.title}</CardTitle>
          <CardDescription>Order your {dish.title} today!</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <img
              src={dish.image_url}
              alt={dish.title}
              className="rounded-md object-cover h-48 w-full"
            />
            <p>{dish.description}</p>
            <p className="text-xl font-semibold">Price: ${dish.price.toFixed(2)}</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Phone Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any special requests or notes for the chef?"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Place Order"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDish;
