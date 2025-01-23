import React, { useState } from 'react';
import { Menu, LayoutDashboard, Utensils, BookOpen, ShoppingCart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarHeader, SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import DashboardContent from './DashboardContent';
import FoodsContent from './FoodsContent';
import BlogsContent from './BlogsContent';
import OrdersContent from './OrdersContent';
import { ChevronDown } from "lucide-react";

const AdminDashboard = () => {
  const [selectedOption, setSelectedOption] = useState('dashboard');
  const [openDropdown, setOpenDropdown] = useState(null);

  const renderComponent = () => {
    switch (selectedOption) {
      case 'dashboard':
        return <DashboardContent />;
      case 'foods':
        return <FoodsContent />;
      case 'blogs':
        return <BlogsContent />;
      case 'orders':
        return <OrdersContent />;
      default:
        return <DashboardContent />;
    }
  };

  const toggleDropdown = (option) => {
    setOpenDropdown((prevOption) => (prevOption === option ? null : option));
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen ">
        <Sidebar className="fixed  left-0 top-0 bottom-0 w-64 z-40 bg-white shadow-lg mt-[5rem]">
          <SidebarHeader className="p-4 border-b">
            <h2 className="text-xl font-bold mt-[2rem]">Admin Dashboard</h2>
          </SidebarHeader>
          <SidebarContent>
            <nav className="mt-6">
              <ul className="space-y-2">
                <li>
                  <Button
                    variant="ghost"
                    className="w-full justify-start p-2 hover:bg-gray-100"
                    onClick={() => setSelectedOption('dashboard')}
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </li>
                <li>
                  <div
                    className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => toggleDropdown('content')}
                  >
                    <div className="flex items-center">
                      <BookOpen className="mr-2 h-4 w-4" />
                      <span>Content</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        openDropdown === 'content' ? "rotate-180" : ""
                      )}
                    />
                  </div>
                  {openDropdown === 'content' && (
                    <ul className="ml-4 mt-2 space-y-1">
                      <li>
                        <Button
                          variant="ghost"
                          className="w-full justify-start p-2 hover:bg-gray-100"
                          onClick={() => setSelectedOption('foods')}
                        >
                          <Utensils className="mr-2 h-4 w-4" />
                          Foods
                        </Button>
                      </li>
                      <li>
                        <Button
                          variant="ghost"
                          className="w-full justify-start p-2 hover:bg-gray-100"
                          onClick={() => setSelectedOption('blogs')}
                        >
                          <BookOpen className="mr-2 h-4 w-4" />
                          Blogs
                        </Button>
                      </li>
                    </ul>
                  )}
                </li>
                <li>
                  <Button
                    variant="ghost"
                    className="w-full justify-start p-2 hover:bg-gray-100"
                    onClick={() => setSelectedOption('orders')}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Orders
                  </Button>
                </li>
              </ul>
            </nav>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 ml-64">
          <header className=" sticky top-0 z-30">
            <div className="flex items-center justify-between px-4 py-3">
              <SidebarTrigger>
                <Menu className="h-6 w-6" />
              </SidebarTrigger>
              <h1 className="text-2xl font-semibold">
                {selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1)}
              </h1>
              <div className="w-6"></div>
            </div>
          </header>

          <main className=" px-4 py-8 max-w-4xl">
            {renderComponent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;

