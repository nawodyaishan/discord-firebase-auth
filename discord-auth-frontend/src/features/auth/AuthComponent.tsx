import { LogOut, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import useUserStore from '@/stores/user-store.ts';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useCurrentUser from '@/hooks/use-current-user.ts';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' })
});

type LoginFormData = z.infer<typeof loginSchema>;

function AuthComponent() {
  const { login, logout } = useUserStore((state) => state);
  const { authUser } = useCurrentUser();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur'
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    const success = await login(data.email, data.password);
    if (success) {
      toast({
        title: 'Login successful',
        description: 'You are now logged in!'
      });
    } else {
      toast({
        title: 'Login failed',
        description: 'Invalid credentials or network issue.'
      });
    }
  };

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      toast({
        title: 'Logout successful',
        description: 'You have been logged out!'
      });
    } else {
      toast({
        title: 'Logout failed',
        description: 'A problem occurred during logout.'
      });
    }
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Account</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem>
            <Sheet>
              {!authUser && (
                <SheetTrigger asChild>
                  <Button onClick={(e) => e.stopPropagation()}>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </SheetTrigger>
              )}
              <SheetContent onClick={(e) => e.stopPropagation()}>
                <SheetHeader>
                  <SheetTitle>Login</SheetTitle>
                </SheetHeader>
                <form onSubmit={handleSubmit(onLoginSubmit)} className="p-4">
                  <div className="mb-4">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      {...register('email')}
                      onClick={(e) => e.stopPropagation()}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs italic">{errors.email.message}</p>
                    )}
                  </div>
                  <div className="mb-4">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      {...register('password')}
                      onClick={(e) => e.stopPropagation()}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-xs italic">{errors.password.message}</p>
                    )}
                  </div>
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button type="submit">Submit</Button>
                    </SheetClose>
                  </SheetFooter>
                </form>
              </SheetContent>
            </Sheet>
          </DropdownMenuItem>
          {authUser && (
            <DropdownMenuItem onSelect={handleLogout}>
              <Button variant={'destructive'}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default AuthComponent;
