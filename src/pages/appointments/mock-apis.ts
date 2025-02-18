/* eslint-disable @typescript-eslint/no-explicit-any */
// src/api/appointments.ts
import { mockAppointments, mockGuests } from './mock-data';

import { Appointment, Guest } from './types';

// This is a mock implementation. Replace with actual API calls in production.
let appointments = [...mockAppointments];

export const fetchAppointments = (): Promise<Appointment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(appointments);
    }, 500);
  });
};

export const createAppointment = (
  appointment: Partial<Appointment>
): Promise<Appointment> => {
  return new Promise((resolve) => {
    const newAppointment: Appointment = {
      ...(appointment as any),
      id: `app_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    appointments.push(newAppointment);
    setTimeout(() => {
      resolve(newAppointment);
    }, 500);
  });
};

export const updateAppointment = (
  id: string,
  appointment: Partial<Appointment>
): Promise<Appointment> => {
  return new Promise((resolve, reject) => {
    const index = appointments.findIndex((app) => app.id === id);

    if (index === -1) {
      reject(new Error('Appointment not found'));
      return;
    }

    const updatedAppointment = {
      ...appointments[index],
      ...appointment,
      updatedAt: new Date().toISOString(),
    };

    appointments[index] = updatedAppointment;

    setTimeout(() => {
      resolve(updatedAppointment);
    }, 500);
  });
};

export const deleteAppointment = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const index = appointments.findIndex((app) => app.id === id);

    if (index === -1) {
      reject(new Error('Appointment not found'));
      return;
    }

    appointments = appointments.filter((app) => app.id !== id);

    setTimeout(() => {
      resolve();
    }, 500);
  });
};

const guests = [...mockGuests];

export const fetchGuests = (): Promise<Guest[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(guests);
    }, 500);
  });
};
