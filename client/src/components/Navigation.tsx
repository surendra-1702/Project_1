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
                Sportzal Fitness
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <span
                    className={`px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-gray-100 ${
                      isActive(item.href)
                        ? 'text-primary bg-primary/10 font-semibold'
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
                    className={`px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-gray-100 flex items-center gap-2 ${
                      isActive(item.href)
                        ? 'text-primary bg-primary/10 font-semibold'
                        : 'text-gray-700 hover:text-primary'
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
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100">
                      <User className="h-4 w-4" />
                      <span className="font-medium">{user.firstName || user.username}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={logout} className="flex items-center justify-start">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth">
                  <Button variant="ghost" className="font-medium">Sign In</Button>
                </Link>
                <Link href="/auth">
                  <Button className="font-medium px-4 py-2">Get Started</Button>
                </Link>
              </div>
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
              <SheetContent side="right" className="w-[320px]">
                <div className="flex flex-col space-y-2 mt-8">
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 px-3">Navigation</h2>
                  </div>
                  
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                    >
                      <span
                        className={`block px-4 py-3 mx-2 rounded-lg text-base font-medium cursor-pointer transition-all duration-200 ${
                          isActive(item.href)
                            ? 'text-primary bg-primary/10 font-semibold'
                            : 'text-gray-700 hover:text-primary hover:bg-gray-100'
                        }`}
                      >
                        {item.name}
                      </span>
                    </Link>
                  ))}
                  
                  {user?.role === 'admin' && (
                    <>
                      <div className="border-t mx-2 my-4"></div>
                      <div className="px-3 mb-2">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Admin</h3>
                      </div>
                      {adminNavigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                        >
                          <span className={`block px-4 py-3 mx-2 rounded-lg text-base font-medium cursor-pointer transition-all duration-200 flex items-center gap-3 ${
                            isActive(item.href)
                              ? 'text-primary bg-primary/10 font-semibold'
                              : 'text-gray-700 hover:text-primary hover:bg-gray-100'
                          }`}>
                            <item.icon className="h-5 w-5" />
                            <span className="flex-1">{item.name}</span>
                            <Badge variant="secondary" className="text-xs">Admin</Badge>
                          </span>
                        </Link>
                      ))}
                    </>
                  )}
                  
                  <div className="border-t mx-2 mt-6 pt-4">
                    {user ? (
                      <div className="space-y-3">
                        <div className="px-4 py-3 mx-2 rounded-lg bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {user.firstName || user.username}
                              </p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                            {user.role === 'admin' && (
                              <Badge variant="default" className="text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                Admin
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          className="w-full justify-start mx-2 text-red-600 hover:text-red-700 hover:bg-red-50"
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
                      <div className="space-y-3 px-2">
                        <Link href="/auth" onClick={() => setMobileOpen(false)}>
                          <Button variant="ghost" className="w-full justify-center">
                            Sign In
                          </Button>
                        </Link>
                        <Link href="/auth" onClick={() => setMobileOpen(false)}>
                          <Button className="w-full justify-center">Get Started</Button>
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
