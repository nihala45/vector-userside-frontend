"use client";

import { cn } from "@repo/ui/lib/utils";
import { Button } from "@repo/ui/components/button";
import { LogOut, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { navigation } from "../../../src/lib/SidebarItems.js";
import { useAuthStore } from "../../../src/store/AuthStore.js";

export function Sidebar({ isOpen, onClose, isCollapsed, onToggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const admin = useAuthStore((state) => state.admin);

  const isActive = (href) => location.pathname === href;

  const renderNavItem = (item, isMobile = false) => {
    const active = isActive(item.href);

    return (
      <Button
        key={item.name}
        variant={active ? "secondary" : "ghost"}
        className={cn(
          "w-full h-10 gap-3 justify-start",
          isCollapsed && !isMobile ? "justify-center px-2" : "",
          active
            ? "bg-violet-100 text-violet-700 border border-violet-200"
            : ""
        )}
        title={isCollapsed && !isMobile ? item.name : undefined}
        onClick={() => {
          navigate(item.href);
          if (isMobile) onClose();
        }}
      >
        <item.icon className="h-4 w-4" />
        {(!isCollapsed || isMobile) && item.name}
      </Button>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 z-40 bg-white border-r border-gray-200 transition-all",
          isCollapsed ? "lg:w-16" : "lg:w-64"
        )}
      >
        {/* Top Logo Section */}
        <div className="px-4 py-4 flex items-center justify-between border-b">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <img
                src="/vector.png"
                alt="Vector Logo"
                className="h-20 w-20"
              />
            
            </div>
          )}

          {isCollapsed && (
            <div className="w-8 h-8 bg-violet-700 text-white rounded-lg flex items-center justify-center">
              V
            </div>
          )}

          <Button variant="ghost" size="sm" onClick={onToggle}>
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* User Info */}
        {!isCollapsed && (
          <div className="px-4 py-3 border-b">
            <p className="font-medium">{admin?.fullName || "Admin User"}</p>
            <p className="text-sm text-gray-500">{admin?.email}</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => renderNavItem(item))}
        </nav>

        {/* Logout */}
        <div className="px-2 py-4 border-t">
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            className="w-full justify-start gap-3"
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && "Logout"}
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 bg-white z-50 w-64 border-r transition-transform lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <div className="flex items-center gap-2">
            <img src="/vector.png" className="h-8" />
            <span className="font-bold text-lg text-violet-700">VECTOR</span>
          </div>

          <Button variant="ghost" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => renderNavItem(item, true))}
        </nav>

        {/* Mobile Logout */}
        <div className="px-2 py-4 border-t">
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            className="w-full justify-start gap-3"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}
    </>
  );
}
