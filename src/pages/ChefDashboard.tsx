import { useState, useEffect } from "react";
import { getChefDishes, Dish, updateDish, deleteDish } from "@/services/dishes";
import { getChefOrders, Order, updateOrderStatus } from "@/services/orders";
import { getChefHostings, Hosting, createHosting, updateHosting } from "@/services/hosting";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import AddDishForm from "@/components/AddDishForm";
import AddHostingForm from "@/components/AddHostingForm";
import EditDishForm from "@/components/EditDishForm";
import EditHostingForm from "@/components/EditHostingForm";

const ChefDashboard = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [hostings, setHostings] = useState<Hosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isAddDishDialogOpen, setIsAddDishDialogOpen] = useState(false);
  const [isAddHostingDialogOpen, setIsAddHostingDialogOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [isEditDishDialogOpen, setIsEditDishDialogOpen] = useState(false);
  const [editingHosting, setEditingHosting] = useState<Hosting | null>(null);
  const [isEditHostingDialogOpen, setIsEditHostingDialogOpen] = useState(false);
  const { isChef } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [dishesData, ordersData, hostingsData] = await Promise.all([
          getChefDishes(),
          getChefOrders(),
          getChefHostings()
        ]);
        setDishes(dishesData);
        setOrders(ordersData);
        setHostings(hostingsData);
      } catch (error) {
        console.error("Failed to fetch chef data:", error);
        toast({
          title: "Error",
          description: "Failed to load your dashboard data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isChef) {
      fetchData();
    }
  }, [isChef]);

  const handleToggleDishAvailability = async (dish: Dish) => {
    try {
      await updateDish(dish.id, { available: !dish.available });
      
      // Update local state
      setDishes(dishes.map(d => 
        d.id === dish.id ? { ...d, available: !d.available } : d
      ));
      
      toast({
        title: "Success",
        description: `${dish.title} is now ${!dish.available ? "available" : "unavailable"}.`,
      });
    } catch (error) {
      console.error("Failed to update dish availability:", error);
      toast({
        title: "Error",
        description: "Failed to update dish availability.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDish = async (id: string) => {
    try {
      await deleteDish(id);
      
      // Update local state
      setDishes(dishes.filter(d => d.id !== id));
      
      toast({
        title: "Success",
        description: "Dish deleted successfully.",
      });
    } catch (error) {
      console.error("Failed to delete dish:", error);
      toast({
        title: "Error",
        description: "Failed to delete dish. It might be associated with existing orders.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateOrderStatus = async (order: Order, newStatus: Order["status"]) => {
    try {
      await updateOrderStatus(order.id, newStatus);
      
      // Update local state
      setOrders(orders.map(o => 
        o.id === order.id ? { ...o, status: newStatus } : o
      ));
      
      setIsUpdateDialogOpen(false);
      setSelectedOrder(null);
      
      toast({
        title: "Success",
        description: `Order status updated to ${newStatus}.`,
      });
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteHosting = async (id: string) => {
    try {
      // This function doesn't exist yet, but we're preparing for it
      // await deleteHosting(id);
      
      // Update local state
      setHostings(hostings.filter(h => h.id !== id));
      
      toast({
        title: "Success",
        description: "Hosting deleted successfully.",
      });
    } catch (error) {
      console.error("Failed to delete hosting:", error);
      toast({
        title: "Error",
        description: "Failed to delete hosting. It might have active bookings.",
        variant: "destructive",
      });
    }
  };
  
  const handleDishAdded = () => {
    setIsAddDishDialogOpen(false);
    
    // Refresh dishes
    getChefDishes().then(newDishes => {
      setDishes(newDishes);
    }).catch(error => {
      console.error("Failed to refresh dishes:", error);
    });
  };
  
  const handleHostingAdded = () => {
    setIsAddHostingDialogOpen(false);
    
    // Refresh hostings
    getChefHostings().then(newHostings => {
      setHostings(newHostings);
    }).catch(error => {
      console.error("Failed to refresh hostings:", error);
    });
  };

  const handleDishEdited = () => {
    setIsEditDishDialogOpen(false);
    setEditingDish(null);
    
    // Refresh dishes
    getChefDishes().then(newDishes => {
      setDishes(newDishes);
    }).catch(error => {
      console.error("Failed to refresh dishes:", error);
    });
  };

  const handleHostingEdited = () => {
    setIsEditHostingDialogOpen(false);
    setEditingHosting(null);
    
    // Refresh hostings
    getChefHostings().then(newHostings => {
      setHostings(newHostings);
    }).catch(error => {
      console.error("Failed to refresh hostings:", error);
    });
  };

  if (!isChef) {
    return (
      <div className="container-custom py-16">
        <h1 className="text-3xl font-bold mb-6">Chef Dashboard</h1>
        <p>This page is only accessible to chefs.</p>
      </div>
    );
  }

  return (
    <div className="container-custom py-16">
      <h1 className="text-3xl font-bold mb-6">Chef Dashboard</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading your dashboard...</p>
        </div>
      ) : (
        <Tabs defaultValue="dishes" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="dishes">Your Dishes</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="hostings">Hostings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dishes">
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-semibold">Manage Your Dishes</h2>
              <Dialog open={isAddDishDialogOpen} onOpenChange={setIsAddDishDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Add New Dish</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add a New Dish</DialogTitle>
                    <DialogDescription>
                      Enter the details of the dish you want to offer to customers
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4">
                    <AddDishForm onSuccess={handleDishAdded} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            {dishes.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold mb-2">You haven't added any dishes yet.</h2>
                <p className="text-gray-600 mb-6">
                  Add your signature dishes to start receiving orders!
                </p>
                <Button onClick={() => setIsAddDishDialogOpen(true)}>Add Your First Dish</Button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {dishes.map((dish) => (
                  <Card key={dish.id}>
                    <CardHeader className="pb-3">
                      <CardTitle>{dish.title}</CardTitle>
                      <CardDescription>{dish.cuisine_type}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="h-40 w-full mb-2 rounded-md overflow-hidden">
                        <img 
                          src={dish.image_url || "/placeholder.svg"} 
                          alt={dish.title} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <p className="text-sm line-clamp-2">{dish.description}</p>
                      <p className="font-medium">${dish.price.toFixed(2)}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={dish.available} 
                          onCheckedChange={() => handleToggleDishAvailability(dish)}
                        />
                        <Label>{dish.available ? "Available" : "Unavailable"}</Label>
                      </div>
                      <div className="space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setEditingDish(dish);
                            setIsEditDishDialogOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteDish(dish.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="orders">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold mb-2">No orders yet!</h2>
                <p className="text-gray-600">
                  Once customers place orders for your dishes, they will appear here.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {orders.map((order) => (
                  <OrderCard 
                    key={order.id} 
                    order={order}
                    onStatusUpdate={(order) => {
                      setSelectedOrder(order);
                      setIsUpdateDialogOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="hostings">
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-semibold">Manage Your Hostings</h2>
              <Dialog open={isAddHostingDialogOpen} onOpenChange={setIsAddHostingDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Create New Hosting</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create a New Hosting</DialogTitle>
                    <DialogDescription>
                      Set up a hosting event where customers can book your culinary experience
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4">
                    <AddHostingForm onSuccess={handleHostingAdded} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            {hostings.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold mb-2">You haven't created any hostings yet.</h2>
                <p className="text-gray-600 mb-6">
                  Create a hosting to invite customers to your culinary experiences!
                </p>
                <Button onClick={() => setIsAddHostingDialogOpen(true)}>Create Your First Hosting</Button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {hostings.map((hosting) => (
                  <Card key={hosting.id}>
                    <CardHeader>
                      <CardTitle>{hosting.title}</CardTitle>
                      <CardDescription>Location: {hosting.location}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm">{hosting.description}</p>
                        <div className="flex justify-between mt-4">
                          <span className="font-medium">Price per guest:</span>
                          <span>${hosting.price_per_guest.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Max guests:</span>
                          <span>{hosting.max_guests}</span>
                        </div>
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Available days:</h4>
                          <div className="flex flex-wrap gap-2">
                            {hosting.available_days.map((day) => (
                              <Badge key={day}>{day}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Time slots:</h4>
                          <div className="flex flex-wrap gap-2">
                            {hosting.time_slots.map((slot) => (
                              <Badge key={slot} variant="outline">{slot}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setEditingHosting(hosting);
                          setIsEditHostingDialogOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteHosting(hosting.id)}
                      >
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Choose a new status for this order.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-3 py-4">
            {selectedOrder && (
              <>
                <Button 
                  onClick={() => handleUpdateOrderStatus(selectedOrder, "accepted")}
                  className="bg-blue-500 hover:bg-blue-600"
                  disabled={selectedOrder.status === "accepted"}
                >
                  Accept Order
                </Button>
                <Button 
                  onClick={() => handleUpdateOrderStatus(selectedOrder, "preparing")}
                  className="bg-purple-500 hover:bg-purple-600"
                  disabled={selectedOrder.status === "preparing" || selectedOrder.status === "pending"}
                >
                  Mark as Preparing
                </Button>
                <Button 
                  onClick={() => handleUpdateOrderStatus(selectedOrder, "ready")}
                  className="bg-green-500 hover:bg-green-600"
                  disabled={
                    selectedOrder.status === "ready" || 
                    selectedOrder.status === "pending" || 
                    selectedOrder.status === "accepted"
                  }
                >
                  Mark as Ready
                </Button>
                <Button 
                  onClick={() => handleUpdateOrderStatus(selectedOrder, "delivered")}
                  className="bg-green-700 hover:bg-green-800"
                  disabled={
                    selectedOrder.status === "delivered" || 
                    selectedOrder.status === "pending" || 
                    selectedOrder.status === "accepted" || 
                    selectedOrder.status === "preparing"
                  }
                >
                  Mark as Delivered
                </Button>
                <Button 
                  onClick={() => handleUpdateOrderStatus(selectedOrder, "cancelled")}
                  className="bg-red-500 hover:bg-red-600"
                  disabled={
                    selectedOrder.status === "cancelled" || 
                    selectedOrder.status === "delivered"
                  }
                >
                  Cancel Order
                </Button>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsUpdateDialogOpen(false);
                setSelectedOrder(null);
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDishDialogOpen} onOpenChange={setIsEditDishDialogOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Dish</DialogTitle>
            <DialogDescription>
              Update the details of your dish
            </DialogDescription>
          </DialogHeader>
          {editingDish && (
            <div className="mt-4">
              <EditDishForm 
                dish={editingDish} 
                onSuccess={handleDishEdited}
                onCancel={() => {
                  setIsEditDishDialogOpen(false);
                  setEditingDish(null);
                }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditHostingDialogOpen} onOpenChange={setIsEditHostingDialogOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Hosting</DialogTitle>
            <DialogDescription>
              Update the details of your culinary event
            </DialogDescription>
          </DialogHeader>
          {editingHosting && (
            <div className="mt-4">
              <EditHostingForm 
                hosting={editingHosting} 
                onSuccess={handleHostingEdited}
                onCancel={() => {
                  setIsEditHostingDialogOpen(false);
                  setEditingHosting(null);
                }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const OrderCard = ({ 
  order, 
  onStatusUpdate 
}: { 
  order: Order; 
  onStatusUpdate: (order: Order) => void;
}) => {
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

  const getStatusBadge = (status: Order["status"]) => {
    const colors: Record<Order["status"], string> = {
      pending: "bg-yellow-500 hover:bg-yellow-600",
      accepted: "bg-blue-500 hover:bg-blue-600",
      preparing: "bg-purple-500 hover:bg-purple-600",
      ready: "bg-green-500 hover:bg-green-600",
      delivered: "bg-green-700 hover:bg-green-800",
      cancelled: "bg-red-500 hover:bg-red-600",
    };

    return (
      <Badge className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">
            Order #{order.id.substring(0, 8)}
          </CardTitle>
          {getStatusBadge(order.status)}
        </div>
        <CardDescription>{formatDate(order.created_at)}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Dish:</span>
            <span>{order.dishes?.title || "Unknown"}</span>
          </div>
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
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => onStatusUpdate(order)}
          disabled={order.status === "delivered" || order.status === "cancelled"}
        >
          Update Status
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ChefDashboard;
