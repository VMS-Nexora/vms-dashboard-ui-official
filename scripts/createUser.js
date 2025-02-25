import PocketBase from 'pocketbase';
import bcrypt from 'bcryptjs';

const pb = new PocketBase('https://eithan-bku.pockethost.io');

const adminToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDE3MDg1MzgsImlkIjoicGo3eW43c2wwNHJxcjFsIiwidHlwZSI6ImFkbWluIn0.K7aoyhVyYbjsX7Ktg6DS-kZIUnkUXeimw_OPVMlLWKY';
pb.authStore.save(adminToken, { id: 'pj7yn7sl04rqr1l', type: 'admin' });

async function createUser(
  name,
  phone_number,
  email,
  password,
  gender,
  identity_card = {},
  images = [],
  role_id
) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const data = {
      name,
      phone_number,
      email,
      password: hashedPassword,
      gender,
      identity_card,
      images,
      role_id,
    };

    const record = await fetch(
      'https://eithan-bku.pockethost.io/api/collections/vms_aW2jaequ_users/records',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(data),
      }
    );

    const response = await record.json();
    console.log('User created successfully:', response);
    return response;
  } catch (error) {
    console.error('Error creating user:', error.message);
    throw error;
  }
}

// Example usage
createUser(
  'Eithan',
  '0772898981',
  'rngbeo1230@gmail.com',
  'Eithan12345678',
  'Male',
  {},
  [],
  '5mlalzs0i28sgul'
);
