import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const initialFoodItems = [
  {
    id: 1,
    name: "Chocolate Wedding Cake",
    description: "Decadent chocolate cake perfect for weddings",
    category: "cake",
    subCategory: "wedding",
    createdAt: "2023-01-01",
    updatedAt: "2023-01-15",
    reviews: 4.5,
    orders: 120,
    image: "/placeholder.svg?height=200&width=200",
    basePrice: 250,
    flavor: "chocolate",
    addOns: ["Extra fondant work"],
  },
  {
    id: 2,
    name: "Margherita Pizza",
    description: "Classic pizza with tomato, mozzarella, and basil",
    category: "dish",
    subCategory: "Italian",
    createdAt: "2023-02-01",
    updatedAt: "2023-02-10",
    reviews: 4.8,
    orders: 200,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 3,
    name: "Ice Cream Assortment",
    description: "Variety pack of premium ice cream flavors",
    category: "frozen",
    subCategory: "dessert",
    createdAt: "2023-03-01",
    updatedAt: "2023-03-05",
    reviews: 4.2,
    orders: 80,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 4,
    name: "Party Platter",
    description: "Assorted finger foods for events",
    category: "catering",
    subCategory: "appetizers",
    createdAt: "2023-04-01",
    updatedAt: "2023-04-20",
    reviews: 4.7,
    orders: 50,
    image: "/placeholder.svg?height=200&width=200",
  },
]

const categories = ["cake", "dish", "frozen", "catering"]
const subCategories = {
  cake: ["wedding", "birthday", "anniversary", "miscellaneous"],
  dish: ["Italian", "Mexican", "Chinese", "Indian"],
  frozen: ["ice cream", "frozen yogurt", "popsicles"],
  catering: ["appetizers", "main course", "desserts", "beverages"],
}
const cakeFlavors = ["chocolate", "vanilla", "black forest", "white forest"]
const cakeAddOns = ["Chocolate add-on", "Extra fondant work"]

export default function FoodCategoryExplorer() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [foodItems, setFoodItems] = useState(initialFoodItems)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [itemToEdit, setItemToEdit] = useState(null)

  const filteredFoodItems =
    selectedCategory === "All" ? foodItems : foodItems.filter((item) => item.category === selectedCategory)

  const handleEdit = (item) => {
    const editedItem = { ...item }
    if (editedItem.category === "cake") {
      editedItem.flavor = editedItem.flavor || cakeFlavors[0]
      editedItem.addOns = editedItem.addOns || []
    }
    setItemToEdit(editedItem)
  }

  const handleSaveEdit = () => {
    setFoodItems(foodItems.map((item) => (item.id === itemToEdit.id ? itemToEdit : item)))
    setItemToEdit(null)
  }

  const handleDelete = () => {
    if (itemToDelete) {
      setFoodItems(foodItems.filter((item) => item.id !== itemToDelete))
      setItemToDelete(null)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setItemToEdit({ ...itemToEdit, image: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  // useEffect hook removed

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-primary mb-6">Explore Food Categories</h1>
      <div className="mb-8 ">
        <Select onValueChange={setSelectedCategory} defaultValue="All">
          <SelectTrigger className="w-[180px] z-[1000] bg-white">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent >
            <SelectItem value="All">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFoodItems.map((item) => (
          <Card key={item.id} className="overflow-hidden z-[-1]">
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="w-full h-48 object-cover mb-4 rounded-md"
              />
              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              <p className="text-sm">
                <strong>Category:</strong> {item.category}
              </p>
              <p className="text-sm">
                <strong>Sub-category:</strong> {item.subCategory}
              </p>
              <p className="text-sm">
                <strong>Created:</strong> {item.createdAt}
              </p>
              <p className="text-sm">
                <strong>Updated:</strong> {item.updatedAt}
              </p>
              <p className="text-sm">
                <strong>Reviews:</strong> {item.reviews}/5
              </p>
              <p className="text-sm">
                <strong>Orders:</strong> {item.orders}
              </p>
              {item.category === "cake" && (
                <>
                  <p className="text-sm">
                    <strong>Base Price:</strong> ${item.basePrice}
                  </p>
                  <p className="text-sm">
                    <strong>Flavor:</strong> {item.flavor}
                  </p>
                  <p className="text-sm">
                    <strong>Add-ons:</strong> {item.addOns?.join(", ") || "None"}
                  </p>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                    <Pencil className="w-4 h-4 mr-2" /> Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit Food Item</DialogTitle>
                    <DialogDescription>
                      Make changes to the food item here. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={itemToEdit?.name || ""}
                        onChange={(e) => setItemToEdit({ ...itemToEdit, name: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={itemToEdit?.description || ""}
                        onChange={(e) => setItemToEdit({ ...itemToEdit, description: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="category" className="text-right">
                        Category
                      </Label>
                      <Select
                        value={itemToEdit?.category || ""}
                        onValueChange={(value) => {
                          const updatedItem = { ...itemToEdit, category: value, subCategory: "" }
                          if (value !== "cake") {
                            delete updatedItem.flavor
                            delete updatedItem.addOns
                          } else {
                            updatedItem.flavor = cakeFlavors[0]
                            updatedItem.addOns = []
                          }
                          setItemToEdit(updatedItem)
                        }}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="subCategory" className="text-right">
                        Sub-category
                      </Label>
                      <Select
                        value={itemToEdit?.subCategory || ""}
                        onValueChange={(value) => setItemToEdit({ ...itemToEdit, subCategory: value })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select a sub-category" />
                        </SelectTrigger>
                        <SelectContent>
                          {subCategories[itemToEdit?.category]?.map((subCategory) => (
                            <SelectItem key={subCategory} value={subCategory}>
                              {subCategory.charAt(0).toUpperCase() + subCategory.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {itemToEdit?.category === "cake" && (
                      <>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="basePrice" className="text-right">
                            Base Price
                          </Label>
                          <Input
                            id="basePrice"
                            type="number"
                            value={itemToEdit?.basePrice || ""}
                            onChange={(e) =>
                              setItemToEdit({ ...itemToEdit, basePrice: Number.parseFloat(e.target.value) })
                            }
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="flavor" className="text-right">
                            Flavor
                          </Label>
                          <Select
                            value={itemToEdit?.flavor || ""}
                            onValueChange={(value) => setItemToEdit({ ...itemToEdit, flavor: value })}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select a flavor" />
                            </SelectTrigger>
                            <SelectContent>
                              {cakeFlavors.map((flavor) => (
                                <SelectItem key={flavor} value={flavor}>
                                  {flavor.charAt(0).toUpperCase() + flavor.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">Add-ons</Label>
                          <div className="col-span-3">
                            {cakeAddOns.map((addOn) => (
                              <div key={addOn} className="flex items-center space-x-2">
                                <Checkbox
                                  id={addOn}
                                  checked={itemToEdit?.addOns?.includes(addOn)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setItemToEdit({ ...itemToEdit, addOns: [...(itemToEdit.addOns || []), addOn] })
                                    } else {
                                      setItemToEdit({
                                        ...itemToEdit,
                                        addOns: itemToEdit.addOns.filter((a) => a !== addOn),
                                      })
                                    }
                                  }}
                                />
                                <label
                                  htmlFor={addOn}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {addOn}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="image" className="text-right">
                        Image
                      </Label>
                      <div className="col-span-3">
                        <Input id="image" type="file" onChange={handleImageChange} className="col-span-3" />
                        {itemToEdit?.image && (
                          <img
                            src={itemToEdit.image || "/placeholder.svg"}
                            alt="Preview"
                            className="mt-2 w-full h-32 object-cover rounded-md"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleSaveEdit}>
                      Save changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm" onClick={() => setItemToDelete(item.id)}>
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you sure you want to delete this item?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete the food item.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setItemToDelete(null)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

