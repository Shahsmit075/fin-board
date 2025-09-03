"use client";

import { ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const apiServices = [
  {
    id: 1,
    name: "API Playground",
    description: "No Limits!",
    route: "/",
    color: "bg-gradient-to-r from-emerald-500 to-blue-500"
  },
  {
    id: 2,
    name: "FinnHub",
    description: "30 API calls / second",
    route: "/dashboard",
    color: "bg-gradient-to-r from-green-500 to-emerald-500"
  },
  {
    id: 3,
    name: "Alpha Vantage",
    description: "5 API calls / minute",
    route: "/dashboard2",
    color: "bg-gradient-to-r from-blue-500 to-cyan-500"
  },
];

export const Header = () => {
  const [selectedService, setSelectedService] = useState(apiServices[0]);

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
            <DropdownMenuTrigger className="flex items-center gap-3 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 hover:from-emerald-500/20 hover:to-blue-500/20 border border-emerald-500/20 hover:border-emerald-500/40 py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25">
              <Avatar className="rounded-lg h-10 w-10 shadow-md">
                <AvatarFallback className={`rounded-lg text-white font-bold text-lg ${selectedService.color}`}>
                  {selectedService.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="text-start flex flex-col gap-1 leading-none">
                <span className="text-base leading-none font-bold text-foreground truncate max-w-[15ch]">
                  {selectedService.name}
                </span>
                <span className="text-xs text-muted-foreground truncate max-w-[18ch]">
                  {selectedService.description}
                </span>
              </div>
              <ChevronsUpDown className="ml-4 h-5 w-5 text-muted-foreground transition-transform duration-200 group-hover:scale-110" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 border-emerald-500/20 shadow-2xl shadow-emerald-500/10 backdrop-blur-sm" align="end">
              <DropdownMenuLabel className="text-base font-semibold text-emerald-700 dark:text-emerald-300">
                API Services
              </DropdownMenuLabel>
              {apiServices.map((service) => (
                <Link key={service.id} to={service.route}>
                  <DropdownMenuItem
                    onClick={() => setSelectedService(service)}
                    className="cursor-pointer py-4 px-4 hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-blue-500/10 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <Avatar className="rounded-md h-10 w-10 shadow-md">
                        <AvatarFallback className={`rounded-md text-white font-bold ${service.color}`}>
                          {service.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col flex-1">
                        <span className="font-semibold text-foreground">{service.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {service.description}
                        </span>
                      </div>
                      {/* {selectedService.id === service.id && (
                        <div className="flex items-center gap-1">
                          <Check className="h-4 w-4 text-emerald-500" />
                          <span className="text-xs bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full font-medium">
                            ACTIVE
                          </span>
                        </div>
                      )} */}
                    </div>
                  </DropdownMenuItem>
                </Link>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
};