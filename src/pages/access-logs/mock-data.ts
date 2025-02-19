/* eslint-disable @typescript-eslint/no-explicit-any */
export const mockVisitorData: any[] = [
  {
    id: 'V001',
    name: 'John Smith',
    imageUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop',
    registrationImage:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop',
    company: 'Tech Corp',
    status: 'entering',
    captureTime: '2025-02-19T09:15:00',
    checkInTime: '2025-02-19T09:20:00',
    office: 'Executive Office - Floor 5',
    purpose: 'Client Meeting',
    hostName: 'Sarah Parker',
    idNumber: 'TC-2025001',
    contactNumber: '+1 234-567-8900',
    temperature: 36.5,
    accessLevel: 'vip',
    cameraLocation: 'Front Entrance',
  },
  {
    id: 'V002',
    name: 'Jane Doe',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop',
    registrationImage:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop',
    company: 'Innovate LLC',
    status: 'exiting',
    captureTime: '2025-02-19T10:00:00',
    checkOutTime: '2025-02-19T10:30:00',
    office: 'R&D Lab - Floor 3',
    purpose: 'Project Discussion',
    hostName: 'Michael Brown',
    idNumber: 'IL-2025002',
    contactNumber: '+1 345-678-9012',
    temperature: 36.7,
    accessLevel: 'contractor',
    cameraLocation: 'Back Entrance',
  },
  {
    id: 'V003',
    name: 'Alice Johnson',
    imageUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop',
    registrationImage:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop',
    company: 'Global Solutions',
    status: 'suspicious',
    captureTime: '2025-02-19T11:45:00',
    office: 'Main Office - Floor 1',
    purpose: 'Interview',
    hostName: 'Emily Davis',
    idNumber: 'GS-2025003',
    contactNumber: '+1 456-789-0123',
    temperature: 37.1,
    accessLevel: 'guest',
    cameraLocation: 'Side Entrance',
    notes: 'Visitor appeared nervous and was escorted out.',
  },
  ...Array.from({ length: 40 }, (_, i) => ({
    id: `V00${i + 4}`,
    name: `Visitor ${i + 4}`,
    imageUrl:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1974&auto=format&fit=crop',
    registrationImage:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1974&auto=format&fit=crop',
    company: `Company ${i + 4}`,
    status: ['entering', 'exiting', 'suspicious'][i % 3],
    captureTime: `2025-02-19T${(9 + (i % 10))
      .toString()
      .padStart(2, '0')}:30:00`,
    checkInTime:
      i % 2 === 0
        ? `2025-02-19T${(9 + (i % 10)).toString().padStart(2, '0')}:35:00`
        : undefined,
    checkOutTime:
      i % 2 !== 0
        ? `2025-02-19T${(9 + (i % 10)).toString().padStart(2, '0')}:50:00`
        : undefined,
    office: `Office ${i + 4} - Floor ${(i % 5) + 1}`,
    purpose: ['Meeting', 'Delivery', 'Interview', 'Security Check', 'Tour'][
      i % 5
    ],
    hostName: `Host ${i + 4}`,
    idNumber: `ID-${i + 4}`,
    contactNumber: `+1 500-600-${7000 + i}`,
    temperature: 36 + (i % 5) * 0.2,
    accessLevel: ['vip', 'guest', 'contractor'][i % 3],
    cameraLocation: ['Front Entrance', 'Back Entrance', 'Side Entrance'][i % 3],
    notes: i % 4 === 0 ? 'Special request required.' : undefined,
  })),
];
