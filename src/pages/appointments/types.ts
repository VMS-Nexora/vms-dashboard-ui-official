export interface Guest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
}

export interface Appointment {
  id: string;
  guestId: string;
  guest?: Guest;
  date: string;
  time: string;
  purpose: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'noshow';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
