/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { message } from 'antd';
import { useVMSConfig } from './useVMSConfig';
import { useTenant } from './useTenant';
import bcrypt from 'bcryptjs';

// Type definitions
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
  is_deleted?: boolean;
}

export interface PaginationParams {
  current: number;
  pageSize: number;
  total: number;
}

const useUserManagement = () => {
  const { dataInstance } = useVMSConfig();
  const { tenantPrefix } = useTenant();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationParams>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Function to sanitize input data to prevent injection attacks
  const sanitizeInput = (input: any): any => {
    if (typeof input === 'string') {
      // Basic sanitization - remove script tags and escape quotes
      return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"');
    } else if (typeof input === 'object' && input !== null) {
      // Recursively sanitize objects
      const sanitized: any = Array.isArray(input) ? [] : {};
      for (const key in input) {
        if (Object.prototype.hasOwnProperty.call(input, key)) {
          sanitized[key] = sanitizeInput(input[key]);
        }
      }
      return sanitized;
    }
    return input;
  };

  // Get user list
  const getUsers = async (searchParams?: Record<string, any>) => {
    if (!dataInstance || !tenantPrefix) {
      console.error('Data instance or tenant prefix is not available');
      message.error('Failed to initialize user management');
      return [];
    }

    setLoading(true);
    try {
      let filter = 'is_deleted = false';

      if (searchParams) {
        // Sanitize search parameters before using them
        const sanitizedParams = sanitizeInput(searchParams);
        Object.entries(sanitizedParams).forEach(([key, value]) => {
          if (value) {
            filter += ` && ${key} ~ "${value}"`;
          }
        });
      }

      const res = await dataInstance.getList({
        resource: `${tenantPrefix}_users`,
        filterString: filter,
        sorters: [{ field: 'created', order: 'asc' }],
      });

      if (!res || !res.data) {
        throw new Error('Failed to get user data');
      }

      // Omit password fields from response
      const response = res.data.map((user: any) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      setUsers(response as unknown as User[]);
      setPagination({
        ...pagination,
        total: res.totalItems || 0,
      });

      return response as unknown as User[];
    } catch (error) {
      console.error('Failed to fetch users:', error);
      message.error('Failed to fetch users');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get single user
  const getUser = async (id: string) => {
    if (!dataInstance || !tenantPrefix) {
      console.error('Data instance or tenant prefix is not available');
      message.error('Failed to initialize user management');
      return null;
    }

    try {
      // Validate ID to prevent injection
      if (!id || typeof id !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(id)) {
        throw new Error('Invalid user ID');
      }

      const res = await dataInstance.getOne({
        resource: `${tenantPrefix}_users`,
        id: id,
      });

      if (!res || !res.data) {
        throw new Error('User not found');
      }

      const user: any = res.data;

      if (user?.is_deleted) {
        throw new Error('User not found or deleted');
      }

      const { password, ...userWithoutPassword } = user;

      return userWithoutPassword as unknown as User;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      message.error('Failed to fetch user details');
      return null;
    }
  };

  // Update user
  const updateUser = async (id: string, userData: Partial<User>) => {
    if (!dataInstance || !tenantPrefix) {
      console.error('Data instance or tenant prefix is not available');
      message.error('Failed to initialize user management');
      return null;
    }

    setLoading(true);
    try {
      // Validate ID
      if (!id || typeof id !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(id)) {
        throw new Error('Invalid user ID');
      }

      // Sanitize input data
      const sanitizedUserData = sanitizeInput(userData);

      // If password is being updated, hash it
      const updatedData = { ...sanitizedUserData };
      if (sanitizedUserData.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(
          sanitizedUserData.password,
          salt
        );
        updatedData.password = hashedPassword;
      }

      const result: any = await dataInstance.update({
        collection: `${tenantPrefix}_users`,
        id: id,
        params: updatedData,
      });

      if (!result || !result.data) {
        throw new Error('Failed to update user');
      }

      message.success('User updated successfully');

      // Remove password from the returned data
      const { password, ...userWithoutPassword } = result.data;

      return userWithoutPassword as unknown as User;
    } catch (error) {
      console.error('Failed to update user:', error);
      message.error('Failed to update user');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete users (soft delete)
  const deleteUsers = async (ids: string[]) => {
    if (!dataInstance || !tenantPrefix) {
      console.error('Data instance or tenant prefix is not available');
      message.error('Failed to initialize user management');
      return false;
    }

    setLoading(true);
    try {
      if (!ids || ids.length === 0) {
        throw new Error('No user IDs provided for deletion');
      }

      // Validate all IDs
      const validIds = ids.filter(
        (id) => typeof id === 'string' && /^[a-zA-Z0-9_-]+$/.test(id)
      );

      if (validIds.length !== ids.length) {
        throw new Error('One or more invalid user IDs provided');
      }

      // Soft delete by setting is_deleted to true
      const deletePromises = validIds.map((id) =>
        dataInstance.update({
          collection: `${tenantPrefix}_users`,
          id: id,
          params: { is_deleted: true },
        })
      );

      const results = await Promise.all(deletePromises);

      // Check if any update failed
      const allSuccessful = results.every((result) => result && result.data);

      if (!allSuccessful) {
        throw new Error('One or more users could not be deleted');
      }

      message.success(
        `${validIds.length} user${
          validIds.length > 1 ? 's' : ''
        } deleted successfully`
      );
      return true;
    } catch (error) {
      console.error('Failed to delete users:', error);
      message.error(
        `Failed to delete users: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Create user
  const createUser = async (userData: Partial<User>) => {
    if (!dataInstance || !tenantPrefix) {
      console.error('Data instance or tenant prefix is not available');
      message.error('Failed to initialize user management');
      return null;
    }

    setLoading(true);
    try {
      // Sanitize input data
      const sanitizedUserData = sanitizeInput(userData);

      // Validate required fields
      if (!sanitizedUserData.email || !sanitizedUserData.password) {
        throw new Error('Email and password are required');
      }

      // Hash the password before storing
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(
        sanitizedUserData.password,
        salt
      );

      // Set is_deleted to false by default and include the hashed password
      const newUserData = {
        ...sanitizedUserData,
        password: hashedPassword,
        is_deleted: false,
      };

      const result: any = await dataInstance.create({
        resource: `${tenantPrefix}_users`,
        variables: newUserData,
      });

      if (!result || !result.data) {
        throw new Error('Failed to create user');
      }

      message.success('User created successfully');

      // Remove password from the returned data
      const { password, ...userWithoutPassword } = result.data;

      return userWithoutPassword as unknown as User;
    } catch (error) {
      console.error('Failed to create user:', error);
      message.error('Failed to create user');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    pagination,
    setPagination,
    getUsers,
    getUser,
    updateUser,
    deleteUsers,
    createUser,
  };
};

export default useUserManagement;
