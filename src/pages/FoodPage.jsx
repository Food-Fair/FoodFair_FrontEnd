import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChooseFoodCard from '@/components/Cards/ChooseFoodCard';


const FoodPage = () => {
  // State to store food items and filtered food items
  const [foodItems, setFoodItems] = useState([]);
  const [filteredFoodItems, setFilteredFoodItems] = useState([]);
  
  // State for filter options
  const [filters, setFilters] = useState({
    name: '',
    category: '',
    subCategory: '',
    minPrice: '',
    maxPrice: ''
  });

  // Fetch all food items on component mount
  useEffect(() => {
    axios.get('http://localhost:8080/api/foods')
      .then(response => {
        setFoodItems(response.data);  // Set all fetched food items
        setFilteredFoodItems(response.data);  // Set initially filtered food items (all)
      })
      .catch(error => {
        console.error('Error fetching food items:', error);
      });
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }));
  };

  // Apply the filter logic
  useEffect(() => {
    let filtered = [...foodItems];

    if (filters.name) {
      filtered = filtered.filter(item => item.name.toLowerCase().includes(filters.name.toLowerCase()));
    }
    if (filters.category) {
      filtered = filtered.filter(item => item.category === filters.category);
    }
    if (filters.subCategory) {
      filtered = filtered.filter(item => item.subCategory === filters.subCategory);
    }
    if (filters.minPrice) {
      filtered = filtered.filter(item => item.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(item => item.price <= parseFloat(filters.maxPrice));
    }

    setFilteredFoodItems(filtered);  // Update filtered food items
  }, [filters, foodItems]);  // Re-run filter when filters or foodItems change

  return (
    <div className="food-page">
      <h2>Food Items</h2>

      {/* Filter Options */}
      <div className="filters">
        <input
          type="text"
          name="name"
          placeholder="Search by name"
          value={filters.name}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Search by category"
          value={filters.category}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="subCategory"
          placeholder="Search by sub-category"
          value={filters.subCategory}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="minPrice"
          placeholder="Min price"
          value={filters.minPrice}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Max price"
          value={filters.maxPrice}
          onChange={handleFilterChange}
        />
      </div>

      {/* Display filtered food items using Card components */}
       <div className="food-cards">
        {filteredFoodItems.length > 0 ? (
            filteredFoodItems.map((food) => (
            <ChooseFoodCard key={food.id} categories={food} />  // Make sure 'food.id' is valid
            ))
        ) : (
            <p>No food items found.</p>
        )}
        </div>
    </div>
  );
};

export default FoodPage;
