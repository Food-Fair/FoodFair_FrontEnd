import React from "react"
import { Button } from "@/components/ui/button"
import { FoodFormDialog } from "./FoodFormDialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Pencil, Trash2 } from "lucide-react"
import axios from "axios"

export default function AdminFoodPage() {
  const [foods, setFoods] = React.useState([])
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [foodToEdit, setFoodToEdit] = React.useState(null)

  const handleAddFood = () => {
    setFoodToEdit(null)
    setIsDialogOpen(true)
  }

  const handleEditFood = (food) => {
    setFoodToEdit(food)
    setIsDialogOpen(true)
  }

  const handleSaveFood = async (newFood, files) => {
    console.log("Saving Food:", newFood) // Debugging output

    try {
      const token = localStorage.getItem("access_token")
      console.log("Token:", token)
      if (!token) {
        throw new Error("User is not authenticated. Token not found.")
      }

      // Create FormData to include both the food data and images
      const formData = new FormData()
      for (const key in newFood) {
        if (newFood.hasOwnProperty(key)) {
          formData.append(key, newFood[key])
        }
      }

      // Append images to formData
      if (files) {
        files.forEach(file => {
          formData.append("images", file)
        })
      }

      // Make the API request with FormData
      const response = await axios.post("http://localhost:8080/admin/foodsCreate", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("response.data", response.data)

      if (response.status === 201) {
        setFoods(prev => [...prev, response.data]) // Add newly created food to the list
      }

      console.log("Food created successfully:", response.data)
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error creating food:", error)
    }
  }

  const handleDeleteFood = (id) => {
    setFoods((prev) => prev.filter((food) => food.id !== id))
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Food Management</h1>

      <Button onClick={handleAddFood} className="mb-4">
        Add Food
      </Button>

      <FoodFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveFood}
        foodToEdit={foodToEdit}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {foods.map((food) => (
          <div key={food.id} className="border p-4 rounded">
            <h3 className="font-bold">{food.name}</h3>
            <p>{food.description}</p>
            <p>Category: {food.category}</p>
            <p>Sub Category: {food.subCategory}</p>
            <p>Weight: {food.weight}g</p>
            <h4 className="font-semibold mt-2">Flavors:</h4>
            <ul>
              {food.flavor.map((f, i) => (
                <li key={i}>
                  {f.name}: ${f.price}
                </li>
              ))}
            </ul>
            {food.images.length > 0 && (
              <img
                src={food.images[0] || "/placeholder.svg"}
                alt={food.name}
                className="mt-2 w-full h-40 object-cover"
              />
            )}
            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline" size="icon" onClick={() => handleEditFood(food)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the food item.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteFood(food.id)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
