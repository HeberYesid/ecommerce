import { z } from 'zod';

// ─── Login / Register ────────────────────────────────────────
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
    .regex(/[0-9]/, 'Password must include at least one number'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
  role: z.enum(['customer', 'seller'], {
    message: 'Please select a role',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

// ─── Seller – Add Product ────────────────────────────────────
export const productSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title cannot exceed 200 characters'),
  price: z
    .string()
    .min(1, 'Price is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Price must be a positive number',
    }),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description cannot exceed 2000 characters'),
  image_url: z
    .string()
    .min(1, 'Image URL is required')
    .url('Please enter a valid URL'),
  category: z.enum(
    ['Electronics', 'Gaming', 'Wearables', 'Home', 'Fashion', 'Other'],
    { message: 'Please select a category' }
  ),
});

export type ProductFormData = z.infer<typeof productSchema>;

// ─── Review ──────────────────────────────────────────────────
export const reviewSchema = z.object({
  rating: z
    .number({ message: 'Rating is required' })
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5'),
  comment: z
    .string()
    .min(5, 'Review must be at least 5 characters')
    .max(1000, 'Review cannot exceed 1000 characters'),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;
