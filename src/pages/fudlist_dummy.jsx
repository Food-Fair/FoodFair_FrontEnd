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

  return (
    <div className="container  p-4 mx-auto">
      {/* Filter Form */}
      <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              placeholder="Search by name"
      className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 
        placeholder-gray-400 shadow-sm 
        focus:border-[#de7f45] focus:outline-none focus:ring-1 focus:ring-[#de7f45]
        text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              placeholder="Search by Category"
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 
                placeholder-gray-400 shadow-sm 
                focus:border-[#de7f45] focus:outline-none focus:ring-1 focus:ring-[#de7f45]
                text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sub Category</label>
            <input
              type="text"
              name="subCategory"
              value={filters.subCategory}
              onChange={handleFilterChange}
              placeholder="Search by SubCategory"
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 
                placeholder-gray-400 shadow-sm 
                focus:border-[#de7f45] focus:outline-none focus:ring-1 focus:ring-[#de7f45]
                text-sm"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-[#de7f45] text-white px-4 py-2 rounded hover:bg-[#eaad87]"
        >
          Search
        </button>
      </form>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Foods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {foods.map((food) => (
          <div 
            key={food.foodId} 
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleFoodClick(food.foodId)}  // Updated this line
          >
            {/* Food Image */}
            {food.images && food.images.length > 0 && (
              <div className="relative">
                <FoodImage imagePath={food.images[0]} />
                {food.images.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-sm">
                    +{food.images.length - 1}
                  </div>
                )}
              </div>
            )}
            
            {/* Food Details */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">{food.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{food.description}</p>
              
              {/* Category and SubCategory */}
              <div className="mt-2">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                  {food.category}
                </span>
                {food.subCategory && (
                  <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                    {food.subCategory}
                  </span>
                )}
              </div>

              {/* Flavors */}
              {food.flavor && food.flavor.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-sm font-semibold text-gray-700">Flavors:</h4>
                  <div className="mt-1">
                    {food.flavor.map((flav, index) => (
                      <span key={index} className="inline-block bg-orange-100 rounded-full px-3 py-1 text-sm font-semibold text-orange-700 mr-2 mb-2">
                        {flav.flavorName} - ${flav.price}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Details */}
              <div className="mt-3 text-sm text-gray-600">
                <p>Weight: {food.weight}g</p>
                <p>Delivery: {food.deliveryTimeInstruction}</p>
              </div>

              {/* Add-ons */}
              {food.addOns && food.addOns.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-sm font-semibold text-gray-700">Available Add-ons:</h4>
                  <div className="mt-1">
                    {food.addOns.map((addon) => (
                      <div key={addon.id} className="text-sm text-gray-600">
                        {addon.name} - ${addon.price}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Created/Updated Dates */}
              <div className="mt-3 text-xs text-gray-500">
                <p>Created: {new Date(food.createdAt).toLocaleDateString()}</p>
                <p>Updated: {new Date(food.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {!loading && foods.length === 0 && (
        <div className="text-center py-4 text-gray-600">
          No foods found matching your criteria
        </div>
      )}

      {/* Image Modal */}
      {/* <ImageModal
        images={selectedImages}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      /> */}

    <FoodDetailModal
        isOpen={selectedFoodId !== null}
        onClose={() => setSelectedFoodId(null)}
        foodId={selectedFoodId}
      />
    </div>
  );
};

export default FoodList;