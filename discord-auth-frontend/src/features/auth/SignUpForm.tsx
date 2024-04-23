import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import useUserStore from '@/stores/user-store.ts';
import { useToast } from '@/components/ui/use-toast';

const signUpSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long.' })
});

export default function SignUpForm() {
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });
  const register = useUserStore((state) => state.register);
  const { toast } = useToast();

  const onSubmit = form.handleSubmit(async (values) => {
    const { email, password } = values;
    try {
      const success = await register(email, password);
      if (success) {
        console.log('Registration successful');
        toast({
          title: 'Registration successful',
          description: 'Welcome aboard!'
        });
        form.reset();
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration error',
        description: error.message || 'An unexpected error occurred'
      });
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormDescription>Enter a valid email address.</FormDescription>
              <FormMessage>{form.formState.errors.email?.message}</FormMessage>
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
                <Input type="password" placeholder="Enter your password" {...field} />
              </FormControl>
              <FormDescription>Password must be at least 6 characters long.</FormDescription>
              <FormMessage>{form.formState.errors.password?.message}</FormMessage>
            </FormItem>
          )}
        />
        <Button type="submit">Register</Button>
      </form>
    </Form>
  );
}
