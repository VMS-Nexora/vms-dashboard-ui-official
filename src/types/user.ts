export interface User {
  id: string;
  created: string;
  updated: string;
  name: string;
  phone_number: string;
  email: string;
  password: string;
  gender: string;
  identity_card: string;
  images: string;
  role_id: string;
  is_delete?: boolean;
}
