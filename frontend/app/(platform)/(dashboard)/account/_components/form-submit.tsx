'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FormSubmitProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'primary' | 'transparent';
}

export const FormSubmit = ({ children, className, variant, disabled }: FormSubmitProps) => {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending || disabled} type="submit" variant={variant} size="lg" className={cn(className)}>
      {children}
    </Button>
  );
};
