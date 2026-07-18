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