import {
  BookUser,
  CircleUser,
  FileText,
  Home,
  Image,
  Menu,
  Moon,
  Newspaper,
  Package2,
  Radio,
  Search,
  Sun,
  UserSquare,
  Users,
} from "lucide-react";
import { Link, useLocation } from "wouter"; // Import from wouter

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "@/contexts/theme-context"; // Import useTheme
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Navbar() {
  const { logout } = useAuth();
  const { setTheme } = useTheme(); // Get the setTheme function from context
  const [location] = useLocation(); // Get the current location from wouter's hook

  const navLinks = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/banner", label: "Banners", icon: Newspaper },
    { href: "/faculty", label: "Faculty", icon: Users },
    { href: "/management", label: "Management", icon: UserSquare },
    { href: "/news", label: "News", icon: Radio },
    { href: "/gallery", label: "Gallery", icon: Image },
    { href: "/cells", label: "Cells", icon: FileText },
    { href: "/ipr", label: "IPR", icon: BookUser },
  ];

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link
              to="/"
              className="flex items-center gap-2 text-lg font-semibold mb-4"
            >
              <Package2 className="h-6 w-6" />
              <span>Admin Panel</span>
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground",
                  location === link.href
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground"
                )}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            ))}
          </nav>

        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>

        </form>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          {/* Theme selection is now part of this dropdown */}

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
