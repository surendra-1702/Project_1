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
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <span className="text-2xl font-bold text-primary cursor-pointer">
                FitTrack Pro
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <span
                    className={`px-3 py-2 text-sm font-medium cursor-pointer transition-colors ${
                      isActive(item.href)
                        ? 'text-primary'
                        : 'text-gray-700 hover:text-primary'
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              ))}
              {user?.role === 'admin' && adminNavigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <span
                    className={`px-3 py-2 text-sm font-medium cursor-pointer transition-colors flex items-center gap-2 ${
                      isActive(item.href)
                        ? 'text-primary'
                        : 'text-gray-700 hover:text-primary'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                    <Badge variant="secondary" className="text-xs">Admin</Badge>
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{user.firstName || user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/auth">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                    >
                      <span
                        className={`block px-3 py-2 text-base font-medium cursor-pointer transition-colors ${
                          isActive(item.href)
                            ? 'text-primary'
                            : 'text-gray-700 hover:text-primary'
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
                      <span className={`block px-3 py-2 text-base font-medium cursor-pointer transition-colors flex items-center gap-2 ${
                        isActive(item.href)
                          ? 'text-primary'
                          : 'text-gray-700 hover:text-primary'
                      }`}>
                        <item.icon className="h-4 w-4" />
                        {item.name}
                        <Badge variant="secondary" className="text-xs">Admin</Badge>
                      </span>
                    </Link>
                  ))}
                  
                  <div className="border-t pt-4">
                    {user ? (
                      <div className="space-y-2">
                        <div className="px-3 py-2 text-sm text-gray-600">
                          Welcome, {user.firstName || user.username}
                          {user.role === 'admin' && (
                            <Badge variant="default" className="ml-2 text-xs">Admin</Badge>
                          )}
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
