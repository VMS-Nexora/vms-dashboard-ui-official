export interface User {
  id: string;
  created: string;
  updated: string;
  name: string;
  phone_number: string;
  email: string;
  password: string;
  gender: string;
  identity_card: Record<string, unknown>;
  images: string[];
  role_id: string;
}
