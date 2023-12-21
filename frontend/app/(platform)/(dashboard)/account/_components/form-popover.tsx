'use client';

import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { ElementRef, useRef, ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';

import { changeProfileName } from '@/services';
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from '@/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormSubmit } from './form-submit';

interface FormPopoverProps {
  children: ReactNode;
  side?: 'left' | 'right' | 'top' | 'bottom';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  value: string;
  token: string;
}

const formSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name is required',
    })
    .min(3, {
      message: 'Name must be at least 3 characters',
    }),
});

export const FormPopover = ({ children, side = 'bottom', align, sideOffset = 0, value, token }: FormPopoverProps) => {
  const router = useRouter();
  const closeRef = useRef<ElementRef<'button'>>(null);

  const [name, setName] = useState(value);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: value,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const closePopover = () => {
    closeRef.current?.click();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.name === value) return closePopover();

    const response = await changeProfileName(values, token);

    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
      setName(values.name);
      router.refresh();
    }

    closePopover();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align={align} className="w-80 pt-3" side={side} sideOffset={sideOffset}>
        <div className="text-sm font-medium text-start text-neutral-600 pb-4">Change Name</div>
        <PopoverClose ref={closeRef} asChild>
          <Button className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600" variant="ghost">
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" autoComplete="name" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormSubmit variant="primary" className="w-full" disabled={isSubmitting || !isValid}>
              Change
            </FormSubmit>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
};
