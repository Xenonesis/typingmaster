import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Sheet, SheetContent, SheetTrigger } from "./sheet";
import { Menu } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface MobileNavProps {
  items: NavItem[];
  className?: string;
  children?: React.ReactNode;
}

export function MobileNav({ items, className, children }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const location = useLocation();
  
  if (!isMobile) return null;
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[80vw] max-w-[300px] p-0 rounded-r-lg shadow-lg">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-border/10">
            <h2 className="text-lg font-semibold">Menu</h2>
          </div>
          <nav className="flex-1 overflow-auto py-2">
            <ul className="grid gap-1 p-2">
              {items.map((item, index) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={index}>
                    <Link 
                      to={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-md text-sm transition-colors",
                        isActive 
                          ? "bg-primary/10 text-primary font-medium" 
                          : "hover:bg-secondary/80"
                      )}
                    >
                      {item.icon && (
                        <span className="text-primary/70">{item.icon}</span>
                      )}
                      {item.label}
                      {isActive && (
                        <motion.div
                          layoutId="activeNavIndicator"
                          className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          {children && (
            <div className="p-4 border-t border-border/10 mt-auto">
              {children}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}