'use client';

import * as z from 'zod';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { register } from '@/services';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const formSchema = z
  .object({
    name: z
      .string({
        required_error: 'Email is required',
      })
      .min(3, {
        message: 'Name too short',
      }),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email({
        message: 'Email not valid',
      }),
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
  });

export const RegisterForm = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await register(values);

    if (response.error) {
      toast.error(response.message);
    } else {
      const { data } = response.data;

      if (data) {
        Cookies.set('token', data, {
          path: '/',
          expires: 1,
          secure: true,
          sameSite: 'none',
        });
      }

      toast.success(response.message);

      router.push('/dashboard');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 mt-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="name" autoComplete="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="current-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="confirmPassword" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="primary" size="lg" className="w-full mt-8" disabled={!isValid || isSubmitting}>
          Continue
        </Button>
      </form>
    </Form>
  );
};
