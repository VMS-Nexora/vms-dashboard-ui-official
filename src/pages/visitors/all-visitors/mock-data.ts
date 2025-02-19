// mockData.ts

export interface Office {
  id: number;
  name: string;
  floor: string;
  departments: Department[];
}

export interface Department {
  id: number;
  name: string;
  officeId: number;
}

export interface Host {
  id: number;
  name: string;
  departmentId: number;
  email: string;
  phone: string;
}

export interface Visitor {
  id: number;
  name: string;
  email: string;
  phone: string;
  purpose: string;
  hostId: number;
  officeId: number;
  departmentId: number;
  checkIn: Date;
  checkOut: Date | null;
  status: 'active' | 'completed' | 'cancelled';
  idNumber: string;
  idType: 'passport' | 'national_id' | 'drivers_license';
}

export const mockOffices: Office[] = [
  {
    id: 1,
    name: 'Main Building',
    floor: '1st Floor',
    departments: [
      { id: 1, name: 'HR', officeId: 1 },
      { id: 2, name: 'IT', officeId: 1 },
    ],
  },
  {
    id: 2,
    name: 'Tech Hub',
    floor: '2nd Floor',
    departments: [
      { id: 3, name: 'Engineering', officeId: 2 },
      { id: 4, name: 'Research', officeId: 2 },
    ],
  },
];

export const mockHosts: Host[] = [
  {
    id: 1,
    name: 'John Doe',
    departmentId: 1,
    email: 'john@example.com',
    phone: '123-456-7890',
  },
  {
    id: 2,
    name: 'Jane Smith',
    departmentId: 2,
    email: 'jane@example.com',
    phone: '123-456-7891',
  },
];

export const generateMockVisitors = (count: number): Visitor[] => {
  const names = [
    'Alice Johnson',
    'Bob Williams',
    'Charlie Brown',
    'David Smith',
    'Emma Johnson',
    'Frank Harris',
    'Grace Wilson',
    'Henry Miller',
    'Ivy Clark',
    'Jack Davis',
  ];
  const purposes = [
    'Meeting',
    'Interview',
    'IT Support',
    'Consultation',
    'Vendor Meeting',
    'Training',
  ];
  const statuses: Visitor['status'][] = ['active', 'completed', 'cancelled'];
  const idTypes: Visitor['idType'][] = [
    'passport',
    'national_id',
    'drivers_license',
  ];

  return Array.from({ length: count }, (_, i) => {
    const name = names[i % names.length];
    const checkIn = new Date(
      `2025-02-19T${(9 + (i % 8)).toString().padStart(2, '0')}:00:00`
    );
    const checkOut =
      Math.random() > 0.5
        ? new Date(checkIn.getTime() + (Math.random() * 2 + 1) * 3600000)
        : null;

    return {
      id: i + 1,
      name,
      email: `${name.toLowerCase().replace(' ', '')}@example.com`,
      phone: `123-456-78${(90 + i) % 10}`,
      purpose: purposes[i % purposes.length],
      hostId: (i % 2) + 1,
      officeId: (i % 2) + 1,
      departmentId: (i % 4) + 1,
      checkIn,
      checkOut,
      status: statuses[i % statuses.length],
      idNumber: `ID${(100000 + i).toString()}`,
      idType: idTypes[i % idTypes.length],
    };
  });
};
