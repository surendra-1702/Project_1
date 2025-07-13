import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navigation() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Exercises', href: '/exercises' },
    { name: 'BMI Calculator', href: '/bmi' },
    { name: 'Workout Planner', href: '/planner' },
    { name: 'Calorie Counter', href: '/calories' },
    { name: 'Workout Tracker', href: '/workout-tracker' },
    { name: 'Weight Tracker', href: '/weight-tracker' },
  ];

  const adminNavigation = [
    { name: 'Admin Dashboard', href: '/admin', icon: Shield },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location === '/';
    return location.startsWith(href);
  };

  return (
    <nav className="bg-black/95 backdrop-blur-md shadow-2xl sticky top-0 z-50 border-b border-red-600/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <span className="text-3xl font-black text-energy cursor-pointer text-athletic tracking-wider hover:scale-105 transition-all duration-300">
                FITTRACK PRO
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block overflow-hidden">
            <div className="ml-10 flex items-center space-x-2">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <span
                    className={`px-3 py-2 text-sm font-bold cursor-pointer transition-all duration-300 rounded-md uppercase tracking-wide ${
                      isActive(item.href)
                        ? 'bg-red-600 text-white shadow-md'
                        : 'text-white hover:bg-red-600/10 hover:text-red-400'
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              ))}
              {user?.role === 'admin' && adminNavigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <span
                    className={`px-3 py-2 text-sm font-bold cursor-pointer transition-all duration-300 rounded-md uppercase tracking-wide flex items-center gap-1.5 ${
                      isActive(item.href)
                        ? 'bg-red-600 text-white shadow-md'
                        : 'text-white hover:bg-red-600/10 hover:text-red-400'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-3 overflow-hidden">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 text-white hover:bg-red-600/10 hover:text-red-400 font-bold uppercase tracking-wide px-3 py-2 rounded-md">
                    <User className="h-4 w-4" />
                    <span className="text-sm">{user.firstName || user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-black/95 border-red-600/20 backdrop-blur-md">
                  <DropdownMenuItem onClick={logout} className="text-white hover:bg-red-600/20 hover:text-red-400 font-medium">
                    <LogOut className="h-4 w-4 mr-2" />
                    SIGN OUT
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="ghost" className="text-white hover:bg-red-600/10 hover:text-red-400 font-bold uppercase tracking-wide text-sm px-3 py-2 rounded-md">SIGN IN</Button>
                </Link>
                <Link href="/auth">
                  <Button className="btn-primary font-bold uppercase tracking-wide text-sm px-4 py-2 rounded-md">GET STARTED</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-red-600/10 hover:text-red-400">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-black/95 border-red-600/20 backdrop-blur-md">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                    >
                      <span
                        className={`block px-4 py-3 text-base font-bold cursor-pointer transition-all duration-300 rounded-lg uppercase tracking-wide hover-lift ${
                          isActive(item.href)
                            ? 'bg-red-600 text-white shadow-lg'
                            : 'text-white hover:bg-red-600/10 hover:text-red-400'
                        }`}
                      >
                        {item.name}
                      </span>
                    </Link>
                  ))}
                  
                  {user?.role === 'admin' && adminNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                    >
                      <span className={`block px-4 py-3 text-base font-bold cursor-pointer transition-all duration-300 rounded-lg uppercase tracking-wide flex items-center gap-2 hover-lift ${
                        isActive(item.href)
                          ? 'bg-red-600 text-white shadow-lg'
                          : 'text-white hover:bg-red-600/10 hover:text-red-400'
                      }`}>
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </span>
                    </Link>
                  ))}
                  
                  <div className="border-t pt-4">
                    {user ? (
                      <div className="space-y-2">
                        <div className="px-3 py-2 text-sm text-gray-600">
                          Welcome, {user.firstName || user.username}
                        </div>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            logout();
                            setMobileOpen(false);
                          }}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Link href="/auth" onClick={() => setMobileOpen(false)}>
                          <Button variant="ghost" className="w-full">
                            Sign In
                          </Button>
                        </Link>
                        <Link href="/auth" onClick={() => setMobileOpen(false)}>
                          <Button className="w-full">Get Started</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
