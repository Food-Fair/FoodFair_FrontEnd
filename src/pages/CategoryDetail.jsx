import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { cake_bill } from "../assets/images";
import ChooseFoodCard from "../components/Cards/ChooseFoodCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const subCategories = {
  cake: ["wedding", "birthday", "anniversary", "miscellaneous"],
  dish: ["Italian", "Mexican", "Chinese", "Indian"],
  frozen: ["ice cream", "frozen yogurt", "popsicles"],
  catering: ["appetizers", "main course", "desserts", "beverages"],
};

const CategoryDetail = () => {
  const { category_name } = useParams();
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Set default subcategory when category changes
  useEffect(() => {
    if (category_name && subCategories[category_name]) {
      setSelectedSubCategory(subCategories[category_name][0]);
    } else {
      setSelectedSubCategory("");
    }
  }, [category_name]);

  // Fetch food items when category or subcategory changes
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        setLoading(true);
        console.log("Fetching food items for:", selectedSubCategory+"xx");
        const response = await axios.get(
          `http://localhost:8080/foods/filter?subCategory=${selectedSubCategory}`
        );
        console.log("Fetched food items:", response.data);

        // Append full image URL to each food item
        const updatedFoodItems = response.data.map((food) => ({
          ...food,
          imageUrl: food.images.length > 0
            ? `http://localhost:8080/foods/image/${food.images[0]}`
            : null
        }));

        setFoodItems(updatedFoodItems);
        console.log("Updated food items:", updatedFoodItems.imageUrl);
      } catch (err) {
        setError("Failed to load food items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (category_name && selectedSubCategory) {
      fetchFoodItems();
    }
  }, [category_name, selectedSubCategory]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="category-detail-page">
      <div className="category-header">
        <img src={cake_bill} alt={category_name} className="w-full h-[25rem] mt-6" />
      </div>

      {/* Select Dropdown */}
      <div className="mb-8 flex justify-center mt-8">
  <Select
    value={selectedSubCategory}
    onValueChange={(value) => setSelectedSubCategory(value)}
  >
    <SelectTrigger className="w-full max-w-md mx-auto bg-white border border-gray-300 rounded-md shadow-md focus:ring focus:ring-indigo-200">
      <SelectValue placeholder="Select a subcategory" />
    </SelectTrigger>
    <SelectContent className="bg-white border border-gray-300 shadow-lg rounded-md z-50">
      {category_name && subCategories[category_name] ? (
        subCategories[category_name].map((subcategory) => (
          <SelectItem key={subcategory} value={subcategory}>
            {subcategory}
            {console.log(subcategory+"xx")}
          </SelectItem>
        ))
      ) : (
        <SelectItem value="none" disabled>
          No subcategories available
        </SelectItem>
      )}
    </SelectContent>
  </Select>
</div>


      {/* Render Food Cards with Images */}
      <div className="center max-container w-4/5">
      <div className="grid grid-cols-1 md:grid-rows-3 gap-4">
      <ChooseFoodCard categories={foodItems} />

          </div>
          </div>
      
      </div>
  );
};

export default CategoryDetail;
