import React, { useState } from 'react';
import { Utensils, BookOpen, ShoppingCart, LayoutDashboard } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import DashboardContent from './DashboardContent';
import FoodsContent from './FoodsContent';
import BlogsContent from './BlogsContent';
import OrdersContent from './OrdersContent';
import { ChevronDown } from "lucide-react";
import CreateFood from './CreateFood';
import FoodList from './FoodList';

const AdminDashboard = () => {
  const [selectedOption, setSelectedOption] = useState('dashboard');
  const [openDropdown, setOpenDropdown] = useState(null);

  const renderComponent = () => { 
    switch (selectedOption) { 
      case 'dashboard': 
        return <DashboardContent />; 
      case 'foods': 
        return <CreateFood />; 
      case 'blogs': 
        return <BlogsContent />; 
      case 'orders': 
        return <OrdersContent />; 
      case 'food-list': 
        return <FoodList /> 
      default: 
        return <DashboardContent />; 
    } 
  };

  const toggleDropdown = (option) => {
    setOpenDropdown((prevOption) => (prevOption === option ? null : option));
  };

  return (
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen">
          <Sidebar className="fixed left-0 top-[5rem] w-64 z-40 bg-white shadow-lg">
            <SidebarHeader className="p-4 border-b bg-white">
              <h2 className="text-xl font-bold">Admin Dashboard</h2>
            </SidebarHeader>
            <SidebarContent className="">
              <nav className="p-4">
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
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start p-2 hover:bg-gray-100" 
                    onClick={() => setSelectedOption('food-list')} 
                  > 
                    <ShoppingCart className="mr-2 h-4 w-4" /> 
                    Food List 
                  </Button>
                </ul>
              </nav>
            </SidebarContent>
          </Sidebar>
  
          <div className="flex-1 ml-64 pt-[5rem]">
            <main className="px-4 py-8 max-w-4xl">
              {renderComponent()}
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
};

export default AdminDashboard;