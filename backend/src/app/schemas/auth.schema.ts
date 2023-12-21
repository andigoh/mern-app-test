import { z } from 'zod';

export const registerSchema = z.object({
  body: z
    .object({
      name: z.string({
        required_error: 'Name is required',
      }),
      email: z
        .string({
          required_error: 'Email is required',
        })
        .email('Email is not valid'),
      password: z
        .string()
        .min(8, {
          message: 'Password must be at least 8 characters long',
        })
        .refine((value) => /[a-z]/.test(value), {
          message: 'Password must contain at least one lowercase character',
          path: ['password'],
        })
        .refine((value) => /[A-Z]/.test(value), {
          message: 'Password must contain at least one uppercase character',
          path: ['password'],
        })
        .refine((value) => /\d/.test(value), {
          message: 'Password must contain at least one digit',
          path: ['password'],
        })
        .refine((value) => /[@$!%*?&]/.test(value), {
          message: 'Password must contain at least one special character',
          path: ['password'],
        }),
      confirmPassword: z
        .string()
        .min(8, {
          message: 'Confirm password must be at least 8 characters long',
        })
        .refine((value) => /[a-z]/.test(value), {
          message: 'Confirm password must contain at least one lowercase character',
          path: ['confirmPassword'],
        })
        .refine((value) => /[A-Z]/.test(value), {
          message: 'Confirm password must contain at least one uppercase character',
          path: ['confirmPassword'],
        })
        .refine((value) => /\d/.test(value), {
          message: 'Confirm password must contain at least one digit',
          path: ['confirmPassword'],
        })
        .refine((value) => /[@$!%*?&]/.test(value), {
          message: 'Confirm password must contain at least one special character',
          path: ['confirmPassword'],
        }),
    })
    .superRefine(({ password, confirmPassword }, ctx) => {
      if (password !== confirmPassword) {
        ctx.addIssue({
          code: 'custom',
          message: 'Passwords did not match',
        });
      }
    }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Email is not valid'),
    password: z.string().min(8, {
      message: 'Password must be at least 8 characters long',
    }),
  }),
});
