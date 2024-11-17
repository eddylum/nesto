export interface Property {
  id: string;
  name: string;
  address: string;
  image_url: string;
  user_id: string;
  created_at: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  property_id: string;
  created_at: string;
}