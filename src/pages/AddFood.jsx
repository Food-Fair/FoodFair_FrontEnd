import React, { useState } from "react";
import axios from "axios";

const AddFood = () => {
  const [foodData, setFoodData] = useState({
    name: "",
    description: "",
    category: "",
    subCategory: "",
    weight: "",
    deliveryTimeInstruction: "",
    images: null,

  });
  const [flavors, setFlavors] = useState([]);
  const [newFlavor, setNewFlavor] = useState({ flavorName: "", price: "" });
  const [images, setImages] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFoodData({ ...foodData, [name]: value });
  };

  const handleFlavorChange = (e) => {
    const { name, value } = e.target;
    setNewFlavor({ ...newFlavor, [name]: value });
  };

  const addFlavor = () => {
    if (newFlavor.flavorName && newFlavor.price) {
      setFlavors([...flavors, newFlavor]);
      setNewFlavor({ flavorName: "", price: "" });
    } else {
      alert("Please fill out both flavor name and price.");
    }
  };

  const removeFlavor = (index) => {
    setFlavors(flavors.filter((_, i) => i !== index));
  };

  const handleFileChange = (e) => {
    setImages(e.target.files);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", foodData.name);
    formData.append("description", foodData.description);
    formData.append("category", foodData.category);
    formData.append("subCategory", foodData.subCategory);
    formData.append("weight", foodData.weight);
    formData.append("deliveryTimeInstruction", foodData.deliveryTimeInstruction);

    // Append flavors as JSON
    formData.append("flavor", JSON.stringify(flavors));

    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }
    }

    try {

        const token = localStorage.getItem("token"); // Adjust if you're storing the token elsewhere
        console.log("Token:", token);
        if (!token) {
          throw new Error("User is not authenticated. Token not found.");
        }
      const response = await axios.post(
        "http://localhost:8080/admin/foodsCreate",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // Send credentials (like cookies) with the request

        }
      );
      alert("Food item added successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error adding food item:", error);
      alert("Failed to add food item.");

      console.log("Error Details:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      <h2>Add Food Item</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={foodData.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={foodData.description}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={foodData.category}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="subCategory"
          placeholder="Sub-Category"
          value={foodData.subCategory}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="weight"
          placeholder="Weight (in grams)"
          value={foodData.weight}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="deliveryTimeInstruction"
          placeholder="Delivery Time Instruction"
          value={foodData.deliveryTimeInstruction}
          onChange={handleInputChange}
          required
        />
        <div>
          <h3>Flavors</h3>
          {flavors.map((flavor, index) => (
            <div key={index}>
              <span>{flavor.flavorName} - ${flavor.price}</span>
              <button type="button" onClick={() => removeFlavor(index)}>
                Remove
              </button>
            </div>
          ))}
          <input
            type="text"
            name="flavorName"
            placeholder="Flavor Name"
            value={newFlavor.flavorName}
            onChange={handleFlavorChange}
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={newFlavor.price}
            onChange={handleFlavorChange}
          />
          <button type="button" onClick={addFlavor}>
            Add Flavor
          </button>
        </div>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          required
        />
        <button type="submit">Add Food</button>
      </form>
    </div>
  );
};

export default AddFood;
