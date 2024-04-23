import { LogOut, UserCheck, UserPlus, X } from 'lucide-react';
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
import SignUpForm from './SignUpForm';
import useCurrentUser from '@/hooks/use-current-user.ts';
import { AuthHelpers } from '@/helpers/auth-helpers.ts';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' })
});

type LoginFormData = z.infer<typeof loginSchema>;

const updatePasswordSchema = z.object({
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' })
});

type LinkPasswordFormData = z.infer<typeof updatePasswordSchema>;

function AuthComponent() {
  const {
    login,
    logout,
    twitterLogin,
    linkEmailAndPassword,
    linkTwitterAuthToEmailPass,
    unlinkAuthProvider
  } = useUserStore((state) => state);
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

  const {
    register: registerUpdatePassword,
    handleSubmit: handleUpdatePasswordSubmit,
    formState: { errors: updatePasswordErrors }
  } = useForm<LinkPasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
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
  const handleTwitterLogin = async () => {
    try {
      const success = await twitterLogin();
      if (success) {
        console.log('Twitter login successful');
        toast({
          title: 'Twitter Login Successful',
          description: 'You are now logged in with Twitter!'
        });
      } else {
        console.log('Twitter login failed');
        toast({
          title: 'Twitter Login Failed',
          description: 'An error occurred while signing in with Twitter.'
        });
      }
    } catch (error) {
      console.error('Error during Twitter login:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred during Twitter login.'
      });
    }
  };

  const handleLinkEmailAndPassword = async (data: LinkPasswordFormData) => {
    if (!authUser || !authUser.email) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to update credentials.'
      });
      return;
    }

    try {
      const success = await linkEmailAndPassword(authUser, authUser.email, data.password);
      if (success) {
        toast({
          title: 'Update successful',
          description: 'Your password has been updated.'
        });
      } else {
        throw new Error('Update failed without a specific error message.');
      }
    } catch (error: any) {
      console.error('Update Error:', error);
      toast({
        title: 'Update failed',
        description: error.message || 'An error occurred while updating your password.'
      });
    }
  };

  const handleLinkTwitter = async () => {
    if (!authUser) {
      console.log('No user is logged in.');
      return;
    }

    const success = await linkTwitterAuthToEmailPass(authUser);
    if (success) {
      console.log('Twitter linked successfully.');
    } else {
      console.error('Failed to link Twitter.');
    }
  };

  const handleUnlinkProvider = async (providerId: string) => {
    if (!authUser) {
      toast({
        title: 'Authentication Required',
        description: 'You need to be logged in to modify authentication methods.'
      });
      return;
    }

    try {
      const success = await unlinkAuthProvider(authUser, providerId);
      if (success) {
        toast({
          title: 'Unlink Successful',
          description: `${AuthHelpers.getProviderName(providerId)} has been successfully unlinked from your account.`
        });
        console.log(`${AuthHelpers.getProviderName(providerId)} unlinked successfully.`);
      } else {
        throw new Error(`Failed to unlink ${AuthHelpers.getProviderName(providerId)}.`);
      }
    } catch (error: any) {
      toast({
        title: 'Unlink Failed',
        description: `Could not unlink ${AuthHelpers.getProviderName(providerId)}: ${error.message}`
      });
      console.error(
        `Failed to unlink ${AuthHelpers.getProviderName(providerId)}: ${error.message}`
      );
    }
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Authentication Actions</Button>
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
          {authUser && !AuthHelpers.checkAuthProvider(authUser, 'password') && (
            <DropdownMenuItem>
              <Sheet>
                <SheetTrigger asChild>
                  <Button onClick={(e) => e.stopPropagation()}>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Link Email Auth
                  </Button>
                </SheetTrigger>
                <SheetContent onClick={(e) => e.stopPropagation()}>
                  <SheetHeader>
                    <SheetTitle>Update Password</SheetTitle>
                  </SheetHeader>
                  <form
                    onSubmit={handleUpdatePasswordSubmit(handleLinkEmailAndPassword)}
                    className="p-4">
                    <div className="mb-4">
                      <Label>Password</Label>
                      <Input
                        type="password"
                        {...registerUpdatePassword('password')}
                        onClick={(e) => e.stopPropagation()}
                      />
                      {updatePasswordErrors.password && (
                        <p className="text-red-500 text-xs italic">
                          {updatePasswordErrors.password.message}
                        </p>
                      )}
                    </div>
                    <SheetFooter>
                      <SheetClose asChild>
                        <Button type="submit">Update</Button>
                      </SheetClose>
                    </SheetFooter>
                  </form>
                </SheetContent>
              </Sheet>
            </DropdownMenuItem>
          )}
          {!authUser && (
            <DropdownMenuItem>
              <Sheet>
                <SheetTrigger asChild>
                  <Button onClick={(e) => e.stopPropagation()}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign Up
                  </Button>
                </SheetTrigger>
                <SheetContent onClick={(e) => e.stopPropagation()}>
                  <SheetHeader>
                    <SheetTitle>Sign Up</SheetTitle>
                  </SheetHeader>
                  <SignUpForm />
                </SheetContent>
              </Sheet>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem>
            <Sheet>
              {!authUser && (
                <SheetTrigger asChild>
                  <Button onClick={(e) => e.stopPropagation()}>
                    <X className="mr-2 h-4 w-4" />
                    Twitter Login
                  </Button>
                </SheetTrigger>
              )}
              <SheetContent onClick={(e) => e.stopPropagation()}>
                <SheetHeader>
                  <SheetTitle>Twitter Login</SheetTitle>
                </SheetHeader>
                <Button onClick={handleTwitterLogin} type="submit">
                  Sign in with Twitter
                </Button>
              </SheetContent>
            </Sheet>
          </DropdownMenuItem>
          {authUser && !AuthHelpers.checkAuthProvider(authUser, 'twitter.com') && (
            <DropdownMenuItem onSelect={handleLinkTwitter}>
              <Button variant={'default'}>
                <LogOut className="mr-2 h-4 w-4" />
                Link Twitter Account
              </Button>
            </DropdownMenuItem>
          )}
          {authUser && (
            <DropdownMenuItem onSelect={handleLogout}>
              <Button variant={'destructive'}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </DropdownMenuItem>
          )}
          {authUser &&
            authUser.providerData.map((provider, index) => (
              <DropdownMenuItem key={index}>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button onClick={(e) => e.stopPropagation()}>
                      Unlink {AuthHelpers.getProviderName(provider.providerId)}
                    </Button>
                  </SheetTrigger>
                  <SheetContent onClick={(e) => e.stopPropagation()}>
                    <SheetHeader>
                      <SheetTitle>Confirm Unlink</SheetTitle>
                    </SheetHeader>
                    <p>
                      Are you sure you want to unlink{' '}
                      {AuthHelpers.getProviderName(provider.providerId)}?
                    </p>
                    <Button
                      variant={'destructive'}
                      onClick={() => handleUnlinkProvider(provider.providerId)}>
                      Confirm
                    </Button>
                  </SheetContent>
                </Sheet>
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default AuthComponent;
