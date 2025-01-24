import React, { useState } from 'react';
import { Utensils, BookOpen, ShoppingCart, LayoutDashboard, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import DashboardContent from './DashboardContent';
import { ChevronDown } from "lucide-react";
import CreateFood from './CreateFood';
import FoodList from './FoodList';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import BlogList from './BlogList';
import CreateBlog from './CreateBlog';
import CustomerList from './CustomerList';


const AdminDashboard = () => {
  const [selectedOption, setSelectedOption] = useState('dashboard');
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedOption === 'orders') {
      navigate('/order_');
    }
  }, [selectedOption, navigate]);

  const renderComponent = () => { 
    switch (selectedOption) { 
      case 'dashboard': 
        return <DashboardContent />; 
      case 'foods': 
        return <CreateFood />; 
      case 'blogs': 
        return <CreateBlog />; 
      case 'orders': 
        return null;
      case 'food-list': 
        return <FoodList /> 
      case 'show-customers':
        return <CustomerList />
      default: 
        return <DashboardContent />; 
      
    } 
  };

  const toggleDropdown = (option) => {
    setOpenDropdown((prevOption) => (prevOption === option ? null : option));
  };

  return (
    <div className="flex min-h-screen">
    {/* Sidebar Section */}
    <div className="w-2 ">
    <SidebarProvider defaultOpen={true}>
    <Sidebar className=" left-0 top-[5rem] w-64 h-full bg-white shadow-lg z-40">
        <SidebarHeader className="p-4 border-b bg-white">
          <h2 className="text-xl font-bold">Admin Dashboard</h2>
        </SidebarHeader>
        <SidebarContent>
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
                      <span>Food and Blogs </span>
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
                          Add Foods
                        </Button>
                      </li>
                      <li>
                        <Button
                          variant="ghost"
                          className="w-full justify-start p-2 hover:bg-gray-100"
                          onClick={() => setSelectedOption('blogs')}
                        >
                          <BookOpen className="mr-2 h-4 w-4" />
                          Write Blogs
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
                <li>
                  <Button
                    variant="ghost"
                    className="w-full justify-start p-2 hover:bg-gray-100"
                    onClick={() => setSelectedOption('show-customers')}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Show Customers
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
      </SidebarProvider>
    </div>
  
       {/* Main Content Section */}
       <div className="flex-1 ">
  <main className="w-full min-h-screen pt-[5rem] flex justify-center"> {/* Add `flex` */}
    <div className="w-full max-w-[1200px] bg-white rounded-lg shadow-sm p-6 mx-auto"> {/* Add `mx-auto` */}
      {renderComponent()}
    </div>
  </main>
</div>
  </div>
  );
};

export default AdminDashboard;