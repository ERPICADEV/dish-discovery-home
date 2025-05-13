
export interface ChefProfile {
  id: string;
  name: string;
  location: string;
  profileImage: string;
  bio: string;
  cuisineSpecialty: string;
  rating: number;
  reviewCount: number;
  yearsExperience: string;
  meals: Meal[];
  reviews: Review[];
}

export interface Meal {
  id: string;
  name: string;
  image: string;
  chefName: string;
  price: number;
  description: string;
  location: string;
}

export interface Review {
  id: string;
  user: string;
  rating: number;
  date: string;
  comment: string;
}
