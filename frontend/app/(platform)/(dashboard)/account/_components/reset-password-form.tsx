'use client';

import * as z from 'zod';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { resetPassword } from '@/services';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FormSubmit } from './form-submit';

interface ResetPasswordFormProps {
  token: string;
}

const formSchema = z
  .object({
    currentPassword: z.string().min(8, {
      message: 'Current password must be at least 8 characters long',
    }),
    newPassword: z
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
      }),
    confirmNewPassword: z
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
      }),
  })
  .superRefine(({ newPassword, confirmNewPassword }, ctx) => {
    if (newPassword !== confirmNewPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'New passwords did not match',
      });
    }
  });

const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await resetPassword(values, token!);

    form.reset();

    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);

      router.refresh();
    }
  };

  return (
    <div>
      <h2 className="text-black font-medium">Reset Password</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 mt-3">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="currentPassword" disabled={isSubmitting} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="newPassword" disabled={isSubmitting} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="confirmNewPassword" disabled={isSubmitting} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormSubmit variant="primary" className="mt-4" disabled={isSubmitting || !isValid}>
            Change
          </FormSubmit>
        </form>
      </Form>
    </div>
  );
};

export default ResetPasswordForm;
