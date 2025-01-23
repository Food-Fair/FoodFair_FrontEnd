import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


export function FoodFormDialog({ isOpen, onClose, onSave, foodToEdit }) {
  const [food, setFood] = React.useState({
    name: "",
    description: "",
    category: "",
    subCategory: "",
    flavor: [],
    images: [], // Store multiple images
    weight: 0,
  })

  const [newFlavor, setNewFlavor] = React.useState({ name: "", price: 0 })

  React.useEffect(() => {
    if (foodToEdit) {
      setFood(foodToEdit)
    } else {
      setFood({
        name: "",
        description: "",
        category: "",
        subCategory: "",
        flavor: [],
        images: [],
        weight: 0,
      })
    }
  }, [foodToEdit])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFood((prev) => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value) => {
    setFood((prev) => ({ ...prev, category: value }))
  }

  const handleAddFlavor = () => {
    if (newFlavor.name && newFlavor.price) {
      setFood((prev) => ({
        ...prev,
        flavor: [...prev.flavor, newFlavor],
      }))
      setNewFlavor({ name: "", price: 0 })
    }
  }

  const handleAddImage = (e) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map((file) => URL.createObjectURL(file))
      setFood((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages], // Store multiple images
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  
    const formattedFood = {
      ...food,
      flavor: food.flavor.map((f) => ({
        flavorName: f.name, // Rename `name` to `flavorName`
        price: f.price,
      })),
      addOns: [], // Ensure addOns exist, modify later if needed
      deliveryTimeInstruction: "", // Default empty string for now
    }
    console.log("Formatted Food:", formattedFood)
    onSave(formattedFood)
  }
  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{foodToEdit ? "Edit Food Item" : "Add New Food Item"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={food.name} onChange={handleInputChange} required />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              value={food.description}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={handleCategoryChange} value={food.category}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cake">Cake</SelectItem>
                <SelectItem value="Dish">Dish</SelectItem>
                <SelectItem value="Frozen Food">Frozen Food</SelectItem>
                <SelectItem value="Catering">Catering</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="subCategory">Sub Category</Label>
            <Input id="subCategory" name="subCategory" value={food.subCategory} onChange={handleInputChange} />
          </div>

          <div>
            <Label htmlFor="weight">Weight (in grams)</Label>
            <Input id="weight" name="weight" type="number" value={food.weight} onChange={handleInputChange} required />
          </div>

          <div>
            <Label>Flavors</Label>
            <div className="flex space-x-2 mb-2">
              <Input
                placeholder="Flavor name"
                value={newFlavor.name}
                onChange={(e) => setNewFlavor((prev) => ({ ...prev, name: e.target.value }))}
              />
              <Input
                type="number"
                placeholder="Price"
                value={newFlavor.price}
                onChange={(e) => setNewFlavor((prev) => ({ ...prev, price: Number.parseFloat(e.target.value) }))}
              />
              <Button type="button" onClick={handleAddFlavor}>
                Add
              </Button>
            </div>
            <ul>
              {food.flavor.map((f, index) => (
                <li key={index}>
                  {f.name}: ${f.price}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Label htmlFor="image">Add Images</Label>
            <Input id="image" type="file" accept="image/*" multiple onChange={handleAddImage} />
            <div className="flex space-x-2 mt-2">
              {food.images.map((image, index) => (
                <img key={index} src={image} alt={`Uploaded ${index}`} className="w-16 h-16 object-cover rounded" />
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">{foodToEdit ? "Save Changes" : "Add Food Item"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
