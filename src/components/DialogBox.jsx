// src/components/DialogBox.jsx
import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const DialogBox = ({ isOpen, closeDialog }) => {
  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="text-center">
          <DialogTitle>Subscribe to our Newsletter</DialogTitle>
          <p className="text-sm mt-2 text-gray-500">Sign up to receive weekly newsletters with Anika’s latest recipes, tips, and kitchen hacks.</p>
        </div>
        <div className="grid gap-6 mx-[8rem]  items-center">
          <div className="flex justify-center gap-12 my-4">
            <Label htmlFor="email">Email</Label>
            <Input id="email" className="w-64 gap-6"  />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Subscribe</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogBox;
