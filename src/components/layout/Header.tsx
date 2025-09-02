import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="py-6 border-b border-border/50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <img src="/placeholder.png" alt="FinBoard Logo" className="w-14 h-13" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                FinBoard
              </h1>
              <p className="text-sm text-muted-foreground">
                Interactive Financial Charts
              </p>
            </div>
          </Link>
        </div>
        
        <nav className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-1">
                API Playgrounds
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <Link to="/dashboard">
                <DropdownMenuItem className="cursor-pointer">
                  FinnHub
                </DropdownMenuItem>
              </Link>
              <Link to="/dashboard2">
                <DropdownMenuItem className="cursor-pointer">
                  Alpha Vantage
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
};