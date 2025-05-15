import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { uploadImage } from '../utils/fileUpload';

interface DishItem {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
}

const ChefSignUp = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [experience, setExperience] = useState('');
  const [hostingMethod, setHostingMethod] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [dishes, setDishes] = useState<DishItem[]>([
    {
      id: '1',
      name: '',
      description: '',
      price: '',
      imageUrl: '',
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addNewDish = () => {
    setDishes([
      ...dishes,
      {
        id: Date.now().toString(),
        name: '',
        description: '',
        price: '',
        imageUrl: '',
      },
    ]);
  };

  const removeDish = (dishId: string) => {
    if (dishes.length > 1) {
      setDishes(dishes.filter(dish => dish.id !== dishId));
    } else {
      toast({
        title: "Cannot remove dish",
        description: "You must have at least one dish.",
        variant: "destructive",
      });
    }
  };

  const updateDish = (dishId: string, field: keyof DishItem, value: string) => {
    setDishes(
      dishes.map(dish => 
        dish.id === dishId ? { ...dish, [field]: value } : dish
      )
    );
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const { url, error } = await uploadImage(file, "chefs");
      if (error) {
        toast({ title: "Upload failed", description: error, status: "error" });
        e.target.value = "";
        return;
      }
      setProfileImage(url);
      toast({ title: "Image uploaded", description: "Your profile image has been uploaded.", status: "success" });
    }
  };

  const handleDishImageUpload = (e: React.ChangeEvent<HTMLInputElement>, dishId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateDish(dishId, 'imageUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      // Basic validation for step 1
      if (!name || !email || !location || !bio) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
    }
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Application submitted!",
        description: "We'll review your information and get back to you soon.",
      });
      setIsSubmitting(false);
      // Redirect or show success message
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-3xl">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-2 text-center">Become a Chef on iDISH</h1>
          <p className="text-gray-600 mb-8 text-center">Share your culinary passion and earn money doing what you love</p>

          <div className="mb-8">
            <div className="flex justify-between items-center relative">
              <div className={`flex flex-col items-center ${step >= 1 ? 'text-idish-orange' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium border-2 ${step >= 1 ? 'border-idish-orange bg-idish-peach' : 'border-gray-300'}`}>
                  1
                </div>
                <span className="text-xs mt-1">Profile</span>
              </div>
              <div className={`flex flex-col items-center ${step >= 2 ? 'text-idish-orange' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium border-2 ${step >= 2 ? 'border-idish-orange bg-idish-peach' : 'border-gray-300'}`}>
                  2
                </div>
                <span className="text-xs mt-1">Dishes</span>
              </div>
              <div className={`flex flex-col items-center ${step >= 3 ? 'text-idish-orange' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium border-2 ${step >= 3 ? 'border-idish-orange bg-idish-peach' : 'border-gray-300'}`}>
                  3
                </div>
                <span className="text-xs mt-1">Review</span>
              </div>
              <div className="absolute h-1 bg-gray-200 top-5 left-0 right-0 -z-10">
                <div 
                  className="h-1 bg-idish-orange transition-all duration-500"
                  style={{ width: `${(step - 1) * 50}%` }}
                ></div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-semibold mb-4">Your Profile</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="(555) 123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      placeholder="City, State"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">About You *</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself and your cooking style..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Cooking Experience</Label>
                  <Select value={experience} onValueChange={setExperience}>
                    <SelectTrigger id="experience">
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Home Cook">Home Cook</SelectItem>
                      <SelectItem value="Professional Experience">Professional Experience</SelectItem>
                      <SelectItem value="Culinary School">Culinary School Graduate</SelectItem>
                      <SelectItem value="Chef">Professional Chef</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profileImage">Profile Image</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="profileImage"
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageUpload}
                      className="max-w-xs"
                    />
                    {profileImage && (
                      <div className="relative w-16 h-16">
                        <img
                          src={profileImage}
                          alt="Profile Preview"
                          className="w-16 h-16 object-cover rounded-full"
                        />
                        <button
                          type="button"
                          onClick={() => setProfileImage(null)}
                          className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-fade-in">
                <h2 className="text-xl font-semibold mb-4">Your Dishes</h2>

                <div className="space-y-2 mb-6">
                  <Label htmlFor="hostingMethod">How will you serve your dishes? *</Label>
                  <Select value={hostingMethod} onValueChange={setHostingMethod} required>
                    <SelectTrigger id="hostingMethod">
                      <SelectValue placeholder="Select hosting method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Home Dining">Host guests at my home</SelectItem>
                      <SelectItem value="Pickup">Customers pick up from my location</SelectItem>
                      <SelectItem value="Delivery">I'll deliver to customers</SelectItem>
                      <SelectItem value="Multiple">Multiple options available</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-medium text-lg mb-4">Add your signature dishes</h3>

                  {dishes.map((dish, index) => (
                    <div 
                      key={dish.id} 
                      className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50 relative"
                    >
                      <h4 className="font-medium mb-4">Dish {index + 1}</h4>

                      {dishes.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeDish(dish.id)}
                          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                        >
                          <X size={20} />
                        </Button>
                      )}

                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`dish-name-${dish.id}`}>Dish Name *</Label>
                            <Input
                              id={`dish-name-${dish.id}`}
                              placeholder="e.g., Homemade Lasagna"
                              value={dish.name}
                              onChange={(e) => updateDish(dish.id, 'name', e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`dish-price-${dish.id}`}>Price ($) *</Label>
                            <Input
                              id={`dish-price-${dish.id}`}
                              placeholder="e.g., 12.99"
                              value={dish.price}
                              onChange={(e) => updateDish(dish.id, 'price', e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`dish-description-${dish.id}`}>Description *</Label>
                          <Textarea
                            id={`dish-description-${dish.id}`}
                            placeholder="Describe your dish, ingredients, and preparation..."
                            value={dish.description}
                            onChange={(e) => updateDish(dish.id, 'description', e.target.value)}
                            className="min-h-[80px]"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`dish-image-${dish.id}`}>Dish Image</Label>
                          <div className="flex items-center gap-4">
                            <Input
                              id={`dish-image-${dish.id}`}
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleDishImageUpload(e, dish.id)}
                              className="max-w-xs"
                            />
                            {dish.imageUrl && (
                              <div className="relative w-16 h-16">
                                <img
                                  src={dish.imageUrl}
                                  alt="Dish Preview"
                                  className="w-16 h-16 object-cover rounded"
                                />
                                <button
                                  type="button"
                                  onClick={() => updateDish(dish.id, 'imageUrl', '')}
                                  className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addNewDish}
                    className="w-full border-dashed border-gray-300 hover:border-idish-orange hover:bg-idish-peach/10 text-gray-600 hover:text-idish-orange mt-2"
                  >
                    + Add Another Dish
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-semibold mb-6">Review & Submit</h2>

                <div className="space-y-8">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-medium mb-4">Your Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-medium">{name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-medium">{location}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Hosting Method</p>
                        <p className="font-medium">{hostingMethod}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">Bio</p>
                      <p className="font-medium">{bio}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-medium mb-4">Your Dishes</h3>
                    <div className="space-y-6">
                      {dishes.map((dish, index) => (
                        <div key={dish.id} className="border-t pt-4 first:border-t-0 first:pt-0">
                          <h4 className="font-medium">
                            {dish.name || `Dish ${index + 1}`}
                            <span className="ml-2 font-normal text-sm text-gray-600">
                              ${dish.price}
                            </span>
                          </h4>
                          <p className="text-gray-600 mt-1">{dish.description}</p>
                          {dish.imageUrl && (
                            <div className="mt-2">
                              <img
                                src={dish.imageUrl}
                                alt={dish.name}
                                className="h-20 w-20 object-cover rounded"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-idish-yellow/20 p-6 rounded-lg border border-idish-yellow">
                    <h3 className="font-medium mb-2">What happens next?</h3>
                    <p className="text-gray-700 text-sm">
                      Our team will review your application within 2-3 business days. Once approved, you'll receive an email with instructions to set up your chef profile and start selling your delicious creations!
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="terms" required />
                    <label htmlFor="terms" className="text-sm">
                      I agree to the <a href="#" className="text-idish-orange underline">Terms of Service</a> and <a href="#" className="text-idish-orange underline">Community Guidelines</a>
                    </label>
                  </div>

                  <Button type="submit" className="w-full bg-idish-orange hover:bg-orange-600" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-between">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Back
                </Button>
              )}
              {step < 3 && (
                <Button type="button" onClick={nextStep} className="ml-auto">
                  Continue
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChefSignUp;
