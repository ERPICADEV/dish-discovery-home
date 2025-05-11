
import { useState, useEffect } from "react";
import { getUserOrders, Order } from "@/services/orders";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isCustomer } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getUserOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        toast({
          title: "Error",
          description: "Failed to load your orders.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isCustomer) {
      fetchOrders();
    }
  }, [isCustomer]);

  if (!isCustomer) {
    return (
      <div className="container-custom py-16">
        <h1 className="text-3xl font-bold mb-6">Orders</h1>
        <p>This page is only accessible to customers.</p>
      </div>
    );
  }

  const getStatusBadgeColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "accepted":
        return "bg-blue-500";
      case "preparing":
        return "bg-purple-500";
      case "ready":
        return "bg-green-500";
      case "delivered":
        return "bg-green-700";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container-custom py-16">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">You haven't placed any orders yet.</h2>
          <p className="text-gray-600 mb-6">
            Browse our available dishes and place your first order today!
          </p>
        </div>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="grid gap-6 md:grid-cols-2">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="active">
            <div className="grid gap-6 md:grid-cols-2">
              {orders
                .filter((order) => ["pending", "accepted", "preparing", "ready"].includes(order.status))
                .map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="completed">
            <div className="grid gap-6 md:grid-cols-2">
              {orders
                .filter((order) => ["delivered", "cancelled"].includes(order.status))
                .map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

const OrderCard = ({ order }: { order: Order }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusBadgeColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "accepted":
        return "bg-blue-500 hover:bg-blue-600";
      case "preparing":
        return "bg-purple-500 hover:bg-purple-600";
      case "ready":
        return "bg-green-500 hover:bg-green-600";
      case "delivered":
        return "bg-green-700 hover:bg-green-800";
      case "cancelled":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">
            {order.dishes?.title || "Dish"}
          </CardTitle>
          <Badge className={getStatusBadgeColor(order.status)}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>
        <CardDescription>{formatDate(order.created_at)}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Quantity:</span>
            <span>{order.quantity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Total:</span>
            <span className="font-medium">${order.total_price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Delivery Address:</span>
            <span className="text-right max-w-[60%]">{order.delivery_address}</span>
          </div>
          {order.special_instructions && (
            <div className="pt-2">
              <span className="text-gray-500 block mb-1">Special Instructions:</span>
              <span className="text-sm italic">"{order.special_instructions}"</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Orders;
