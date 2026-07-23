export type UserRole = "user" | "provider" | "admin";

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  imgUrl?: string;
  favorites?: string[];
}

export interface Category {
  _id: string;
  name: string;
  icon?: string;
}

export interface ProviderUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  imgUrl?: string;
}

export interface Provider {
  _id: string;
  user: ProviderUser;
  category: Category;
  description: string;
  price: number;
  city: string;
  location: { type: string; coordinates: [number, number] };
  openness: number;
  isActive: boolean;
  rating: number;
  reviewCount: number;
}

export interface Coords {
  lat: number;
  lng: number;
}
export interface ReviewUser {
  _id: string;
  name: string;
}

export interface Review {
  _id: string;
  provider: string;
  user: ReviewUser;
  rating: number;
  comment?: string;
  createdAt: string;
}