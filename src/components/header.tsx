"use client";

import { Dumbbell, UserCircle, LogOut, History } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for a token to determine auth state
    const token = localStorage.getItem('user-token');
    setIsAuthenticated(!!token);

    const handleStorageChange = () => {
      const token = localStorage.getItem('user-token');
      setIsAuthenticated(!!token);
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Check on navigation changes as well
    handleStorageChange();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user-token');
    setIsAuthenticated(false);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Dumbbell className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block">
            Pavan's Muscle Den AI
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {isAuthenticated === null ? null : isAuthenticated ? (
            <>
                <Button asChild variant="ghost">
                    <Link href="/dashboard/history">
                        <History className="mr-2 h-4 w-4" />
                        History
                    </Link>
                </Button>
               <Button variant="ghost">
                 <UserCircle className="mr-2 h-4 w-4" />
                 My Account
               </Button>
               <Button onClick={handleLogout}>
                 <LogOut className="mr-2 h-4 w-4" />
                 Logout
               </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
