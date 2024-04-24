import './App.css';
import { Toaster } from '@/components/ui/toaster.tsx';
import { ThemeProvider } from '@/components/theme-provider.tsx';
import { ModeToggle } from '@/components/ui/mode-toggle.tsx';
import ActiveUserDisplay from '@/features/auth/ActiveUserDisplay.tsx';
import AuthComponent from '@/features/auth/AuthComponent.tsx';
import { useEffect } from 'react';
import useUserStore from '@/stores/user-store.ts';

function App() {
  const { authenticateWithFirebaseToken } = useUserStore();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');
    if (token) {
      authenticateWithFirebaseToken(token);
    } else if (error) {
      console.error('OAuth error:', decodeURIComponent(error));
    }
  }, [authenticateWithFirebaseToken]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className={'grid grid-rows gap-8'}>
        <ModeToggle />
        <AuthComponent />
        <ActiveUserDisplay />
      </div>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
