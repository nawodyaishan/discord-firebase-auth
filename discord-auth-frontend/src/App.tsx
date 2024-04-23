import './App.css';
import { Toaster } from '@/components/ui/toaster.tsx';
import { ThemeProvider } from '@/components/theme-provider.tsx';
import { ModeToggle } from '@/components/ui/mode-toggle.tsx';
import ActiveUserDisplay from '@/features/auth/ActiveUserDisplay.tsx';
import AuthComponent from '@/features/auth/AuthComponent.tsx';

function App() {
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
