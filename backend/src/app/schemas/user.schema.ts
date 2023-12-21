import { z } from 'zod';

export const userSchema = z.object({
  body: z
    .object({
      name: z.optional(
        z
          .string({
            required_error: 'Name is required',
            invalid_type_error: 'Name is required',
          })
          .min(3, {
            message: 'Name must be at least 3 characters',
          })
      ),
      currentPassword: z.optional(
        z.string().min(8, {
          message: 'Current Password must be at least 8 characters long',
        })
      ),
      newPassword: z.optional(
        z
          .string()
          .min(8, {
            message: 'New password must be at least 8 characters long',
          })
          .refine((value) => /[a-z]/.test(value), {
            message: 'New password must contain at least one lowercase character',
            path: ['newPassword'],
          })
          .refine((value) => /[A-Z]/.test(value), {
            message: 'New password must contain at least one uppercase character',
            path: ['newPassword'],
          })
          .refine((value) => /\d/.test(value), {
            message: 'New password must contain at least one digit',
            path: ['newPassword'],
          })
          .refine((value) => /[@$!%*?&]/.test(value), {
            message: 'New password must contain at least one special character',
            path: ['newPassword'],
          })
      ),
      confirmNewPassword: z.optional(
        z
          .string()
          .min(8, {
            message: 'Confirm new password must be at least 8 characters long',
          })
          .refine((value) => /[a-z]/.test(value), {
            message: 'Confirm new password must contain at least one lowercase character',
            path: ['confirmNewPassword'],
          })
          .refine((value) => /[A-Z]/.test(value), {
            message: 'Confirm new password must contain at least one uppercase character',
            path: ['confirmNewPassword'],
          })
          .refine((value) => /\d/.test(value), {
            message: 'Confirm new password must contain at least one digit',
            path: ['confirmNewPassword'],
          })
          .refine((value) => /[@$!%*?&]/.test(value), {
            message: 'Confirm new password must contain at least one special character',
            path: ['confirmNewPassword'],
          })
      ),
    })
    .superRefine(({ newPassword, confirmNewPassword }, ctx) => {
      if (newPassword !== confirmNewPassword) {
        ctx.addIssue({
          code: 'custom',
          message: 'New passwords did not match',
        });
      }
    }),
});
