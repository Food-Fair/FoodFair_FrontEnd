import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Base URL for your API
const BASE_URL = 'http://localhost:8080'; // Change this to your API URL

// Image Component
const FoodImage = ({ imagePath }) => {
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative w-full h-48">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
      
      {!imageError ? (
        <img
          src={`${BASE_URL}/foods/image/${imagePath}`}
          alt="Food"
          className="w-full h-full object-cover"
          onLoad={() => setLoading(false)}
          onError={() => {
            setImageError(true);
            setLoading(false);
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          <span className="text-gray-500">Image not available</span>
        </div>
      )}
    </div>
  );
};

// Image Modal Component
const ImageModal = ({ images, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative max-w-4xl w-full mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-xl"
        >
          ×
        </button>
        
        <div className="relative">
          <FoodImage imagePath={images[currentImageIndex]} />
          
          {images.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
              >
                ←
              </button>
              <button
                onClick={() => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
              >
                →
              </button>
            </>
          )}
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-2 py-1 rounded-full">
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterSection = ({ filters, onFilterChange, onSubmit }) => (
  <form onSubmit={onSubmit} className=" top-0 z-10 bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md mb-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Search Foods</label>
        <input
          type="text"
          name="name"
          value={filters.name}
          onChange={onFilterChange}
          placeholder="Search by name..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
        <input
          type="text"
          name="category"
          value={filters.category}
          onChange={onFilterChange}
          placeholder="Filter by category..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Sub Category</label>
        <input
          type="text"
          name="subCategory"
          value={filters.subCategory}
          onChange={onFilterChange}
          placeholder="Filter by sub-category..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>
    </div>
    <div className="mt-6 flex justify-end">
      <button
        type="submit"
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg
                 transition-colors duration-200"
      >
        Search Foods
      </button>
    </div>
  </form>
);


const FoodCard = ({ food, onClick }) => (
  <div 
    onClick={onClick}
    className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200
               overflow-hidden cursor-pointer border border-gray-100"
  >
    {food.images && food.images.length > 0 && (
      <div className="relative aspect-w-16 aspect-h-9">
        <FoodImage imagePath={food.images[0]} />
        {food.images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
            +{food.images.length - 1} more
          </div>
        )}
      </div>
    )}
    
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-500 transition-colors">
        {food.name}
      </h3>
      <p className="mt-1 text-sm text-gray-600 line-clamp-2">{food.description}</p>
      
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
          {food.category}
        </span>
        {food.subCategory && (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            {food.subCategory}
          </span>
        )}
      </div>

      {food.flavor && food.flavor.length > 0 && (
        <div className="mt-3">
          <h4 className="text-xs font-semibold text-gray-700 mb-1">Available Flavors:</h4>
          <div className="flex flex-wrap gap-2">
            {food.flavor.slice(0, 2).map((flav, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                {flav.flavorName}
              </span>
            ))}
            {food.flavor.length > 2 && (
              <span className="px-2 py-1 text-xs text-gray-500">
                +{food.flavor.length - 2} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{food.weight}g</span>
        </div>
        <button className="px-3 py-1 text-sm text-orange-500 hover:text-orange-600 font-medium">
          View Details →
        </button>
      </div>
    </div>
  </div>
);

const FoodDetailModal = ({ isOpen, onClose, foodId }) => {
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch food details when foodId changes
  useEffect(() => {
    const fetchFoodDetail = async () => {
      if (!foodId) return;
      
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/foods/${foodId}`);
        setFood(response.data);
      } catch (err) {
        setError('Failed to fetch food details');
        console.error('Error fetching food details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodDetail();
  }, [foodId]);

  // Add keyboard event listener for Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Handle click outside to close
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 overflow-y-auto p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white rounded-lg w-full max-w-4xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-50 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
          aria-label="Close modal"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-gray-600" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>

        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="h-96 flex items-center justify-center text-red-500">
            {error}
          </div>
        ) : food ? (
          <div className="p-6">
            {/* Image Gallery */}
            {food.images && food.images.length > 0 && (
              <div className="relative w-full h-[400px] mb-6">
                <div className="w-full h-full">
                  <img
                    src={`${BASE_URL}/foods/image/${food.images[currentImageIndex]}`}
                    alt={food.name}
                    className="w-full h-full object-contain rounded-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Available';
                    }}
                  />
                </div>
                
                {food.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(prev => 
                          prev === 0 ? food.images.length - 1 : prev - 1
                        );
                      }}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                      aria-label="Previous image"
                    >
                      ←
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(prev => 
                          prev === food.images.length - 1 ? 0 : prev + 1
                        );
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                      aria-label="Next image"
                    >
                      →
                    </button>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-2 py-1 rounded-full">
                      {currentImageIndex + 1} / {food.images.length}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Food Details */}
            <div className="space-y-6 max-h-[calc(100vh-600px)] overflow-y-auto">
              {/* Title and Description */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{food.name}</h2>
                <p className="mt-2 text-gray-600">{food.description}</p>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                <span className="bg-gray-200 rounded-full px-4 py-2 text-sm font-semibold text-gray-700">
                  {food.category}
                </span>
                {food.subCategory && (
                  <span className="bg-gray-200 rounded-full px-4 py-2 text-sm font-semibold text-gray-700">
                    {food.subCategory}
                  </span>
                )}
              </div>

              {/* Flavors Section */}
              {food.flavor && food.flavor.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Available Flavors</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {food.flavor.map((flav, index) => (
                      <div key={index} className="bg-orange-50 p-4 rounded-lg flex justify-between items-center">
                        <span className="font-medium">{flav.flavorName}</span>
                        <span className="text-orange-600 font-semibold">${flav.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add-ons Section */}
              {food.addOns && food.addOns.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Available Add-ons</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {food.addOns.map((addon) => (
                      <div key={addon.id} className="bg-green-50 p-4 rounded-lg">
                        <div className="font-medium text-green-800">{addon.name}</div>
                        <div className="text-sm text-gray-600 mt-1">{addon.description}</div>
                        <div className="text-green-600 font-semibold mt-2">${addon.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700">Weight</h4>
                  <p className="mt-1 text-gray-600">{food.weight}g</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700">Delivery Instructions</h4>
                  <p className="mt-1 text-gray-600">{food.deliveryTimeInstruction}</p>
                </div>
              </div>

              {/* Timestamps */}
              <div className="text-sm text-gray-500 border-t pt-4">
                <div>Created: {new Date(food.createdAt).toLocaleString()}</div>
                <div>Last Updated: {new Date(food.updatedAt).toLocaleString()}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-96 flex items-center justify-center text-gray-500">
            Food not found
          </div>
        )}
      </div>
    </div>
  );
};

// Main FoodList Component
const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    category: '',
    subCategory: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFoodId, setSelectedFoodId] = useState(null);  // Add this line
  //const [selectedImages, setSelectedImages] = useState([]);
  //const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch foods with filters
  const fetchFoods = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.name) params.append('name', filters.name);
      if (filters.category) params.append('category', filters.category);
      if (filters.subCategory) params.append('subCategory', filters.subCategory);

      const response = await axios.get(`${BASE_URL}/foods/filter?${params}`);
      setFoods(response.data);
    } catch (err) {
      setError('Failed to fetch foods');
      console.error('Error fetching foods:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle filter submission
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchFoods();
  };

  // Handle food card click
  // Handle food card click
  const handleFoodClick = (foodId) => {
    setSelectedFoodId(foodId);
  };

  // Initial fetch
  useEffect(() => {
    fetchFoods();
  }, []);

  return  (
    <div className="max-container mx-auto px-4 py-8">
      <FilterSection 
        filters={filters}
        onFilterChange={handleFilterChange}
        onSubmit={handleSubmit}
      />

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
          <p className="text-red-700">{error}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foods.map((food) => (
              <FoodCard
                key={food.foodId}
                food={food}
                onClick={() => handleFoodClick(food.foodId)}
              />
            ))}
          </div>

          {foods.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No foods found matching your criteria</p>
            </div>
          )}
        </>
      )}

      <FoodDetailModal 
        isOpen={selectedFoodId !== null}
        onClose={() => setSelectedFoodId(null)}
        foodId={selectedFoodId}
      />
    </div>
  );
};

export default FoodList;