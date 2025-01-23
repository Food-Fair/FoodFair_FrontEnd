import React, { useState } from 'react';
import { PlusCircle, PencilIcon, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FoodForm from './FoodForm';

const initialFoods = [
  {
    id: 1,
    name: "Chocolate Cake",
    description: "Rich chocolate cake with creamy frosting",
    category: "Cake",
    subCategory: "Birthday",
    images: ["/placeholder.svg?height=100&width=100"],
    weight: 2,
  },
];

const FoodsContent = () => {
  const [foods, setFoods] = useState(initialFoods);
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  const handleFoodUpdate = (updatedFood) => {
    try {
      console.log("Updating Food:", updatedFood); // Debugging output
      setFoods((prevFoods) =>
        prevFoods.map((food) =>
          food.id === updatedFood.id ? updatedFood : food
        )
      );
      console.log("Updated Foods List:", foods);
    } catch (error) {
      console.error("Error updating food:", error);
    }
  };
  
  const handleAddFood = (newFood) => {
    const id = Math.max(...foods.map((f) => f.id), 0) + 1;
    const newFoodWithId = { ...newFood, id };
  
    console.log("Adding New Food:", newFoodWithId); // Debugging output
  
    setFoods((prevFoods) => [...prevFoods, newFoodWithId]);
    console.log("Updated Foods List After Adding:", foods);
    setIsDialogOpen(false);
  };
  
  const handleDeleteFood = (id) => {
    console.log("Deleting Food with ID:", id);
    setFoods((prevFoods) => prevFoods.filter((food) => food.id !== id));
    console.log("Updated Foods List After Deletion:", foods);
  };
  

  const handleFormClose = () => {
    setIsDialogOpen(false); // Close the form after update
  };

  return (
    <Card className='p-6'>
      <CardHeader>
        <CardTitle className="text-2xl">Food Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mb-4">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Food
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Food</DialogTitle>
            </DialogHeader>
            <FoodForm onSubmit={handleAddFood} />
          </DialogContent>
        </Dialog>
        <div className="space-y-4">
          {foods.map((food) => (
            <Card key={food.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{food.name}</h3>
                    <p className="text-sm text-gray-600">{food.description}</p>
                    <p className="text-sm text-gray-600">Category: {food.category}</p>
                    <p className="text-sm text-gray-600">Sub-category: {food.subCategory}</p>
                  </div>
                  <div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="mr-2">
                          <PencilIcon className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Food</DialogTitle>
                        </DialogHeader>
                        <FoodForm food={food} onSubmit={handleFoodUpdate} closeForm={handleFormClose} />
                      </DialogContent>
                    </Dialog>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteFood(food.id)} >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FoodsContent;

