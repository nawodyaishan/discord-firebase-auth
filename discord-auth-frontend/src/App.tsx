import './App.css';
import { Toaster } from '@/components/ui/toaster.tsx';
import { ThemeProvider } from '@/components/theme-provider.tsx';
import { ModeToggle } from '@/components/ui/mode-toggle.tsx';
import ActiveUserDisplay from '@/features/auth/ActiveUserDisplay.tsx';
import SignUpForm from '@/features/auth/SignUpForm.tsx';
import useCurrentUser from '@/hooks/use-current-user.ts';
import AuthComponent from '@/features/auth/AuthComponent.tsx';

function App() {
  const { authUser } = useCurrentUser();
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className={'grid grid-rows gap-8'}>
        <ModeToggle />
        <AuthComponent />
        {!authUser && <SignUpForm />}
        <ActiveUserDisplay />
      </div>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
