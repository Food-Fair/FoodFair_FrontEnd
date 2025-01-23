import React, { useState } from 'react';
import { UserCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const initialAdmin = {
  name: "Admin User",
  email: "admin@example.com",
  phone: "+1 (555) 987-6543",
};

const DashboardContent = () => {
  const [admin, setAdmin] = useState(initialAdmin);

  const handleAdminUpdate = (updatedAdmin) => {
    setAdmin(prevAdmin => ({ ...prevAdmin, ...updatedAdmin }));
  };

  return (
    <Card className='relative h-[15rem] m-2.5 overflow-hidden w-[50rem] rounded-md shadow-md'>
      <CardHeader>
        <CardTitle className="text-3xl">Admin Profile</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Grid Layout */}
        <div className="grid grid-cols-3 gap-4 items-center">
          {/* Admin Details (Left Side) */}
          <div className="col-span-2">
            <div className="text-xl font-semibold">{admin.name}</div>
            <div className="text-gray-600">{admin.email}</div>
            <div className="text-gray-600">{admin.phone}</div>
          </div>

          {/* Profile Image (Right Side) */}
          <div className="flex justify-center">
            <UserCircle className="h-24 w-24 text-gray-400" />
          </div>
        </div>

        {/* Edit Profile Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="mt-4">Edit Profile</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Admin Profile</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleAdminUpdate({
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
              });
            }}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right">Name</label>
                  <Input id="name" name="name" defaultValue={admin.name} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="email" className="text-right">Email</label>
                  <Input id="email" name="email" defaultValue={admin.email} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="phone" className="text-right">Phone</label>
                  <Input id="phone" name="phone" defaultValue={admin.phone} className="col-span-3" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit">Save changes</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default DashboardContent;
