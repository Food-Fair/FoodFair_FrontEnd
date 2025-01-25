import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Star, StarHalf } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export default function FoodDetail() {
  const { id } = useParams();
  const [foodItem, setFoodItem] = useState(null);
  const [addOns, setAddOns] = useState([]);
  const [flavor, setFlavor] = useState("vanilla");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const[flavorIx,setFlavorIx]=useState(0);
  const [error, setError] = useState("");
  const [price, setPrice] = useState(0);
  const [weight, setWeight] = useState(null); // Initialize as null
  const [quantity, setQuantity] = useState(1); // Add quantity state

  
const [userDetails, setUserDetails] = useState({});

const fetchUserDetails = async (userId) => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.get(`http://localhost:8080/api/customer/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    setUserDetails(prev => ({
      ...prev,
      [userId]: response.data
    }));
    console.log('User details:', response.data);
  } catch (error) {
    console.error('Error fetching user details:', error);
  }
};



// Inside your FoodDetail component, add these state variables
const [rating, setRating] = useState(5);
const [reviewText, setReviewText] = useState("");
const [reviews, setReviews] = useState([]);
const [isSubmitting, setIsSubmitting] = useState(false);

// Add these functions for review handling
const fetchReviews = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/api/reviews/${id}`);
    setReviews(response.data);
    // Fetch user details for each review
    response.data.forEach(review => {
      if (review.users && review.users.id) {
        fetchUserDetails(review.users.id);
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
  }
};

useEffect(() => {
  fetchReviews();
}, []);

const handleSubmitReview = async () => {
  if (!reviewText.trim()) {
    alert('Please write a review before submitting');
    return;
  }

  const token = localStorage.getItem('access_token');
  if (!token) {
    alert('Please login to submit a review');
    return;
  }

  setIsSubmitting(true);
  try {
    await axios.post(
      'http://localhost:8080/customer/review',
      {
        foodId: id,
        rating: rating,
        description: reviewText
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    setReviewText('');
    setRating(5);
    alert('Review submitted successfully!');
  } catch (error) {
    console.error('Error submitting review:', error);
    alert('Failed to submit review. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};

// Replace the existing review Card component with this:

  useEffect(() => {
    const fetchFoodItem = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/foods/${id}`);
        setFoodItem(response.data);
        setPrice(response.data.basePrice);
        setWeight(response.data.weight);
        
      } catch (err) {
        setError("Failed to load food details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItem();
  }, [id]);

  useEffect(() => {
    if (foodItem) {
      const flavorPrice = foodItem.flavor?.find((f) => f.flavorName === flavor)?.price || 0;
      const basePrice = foodItem.flavor[flavorIx].price;
      console.log("base Price"+basePrice);
      {weight>1.5 ? 
      setPrice(basePrice * weight) : setPrice(basePrice)}
      console.log()
    }
  }, [flavor, weight, foodItem]);

  
  

  const toggleAddOn = (option) => {
    setAddOns((prevAddOns) =>
      prevAddOns.includes(option)
        ? prevAddOns.filter((addOn) => addOn !== option)
        : [...prevAddOns, option]
    );
  };

  console.log(id)
  const handleAddToCart = () => {
    if (!weight) {
      alert("Please select a weight");
      return;
    }

    if (!flavor) {
      alert("Please select a flavor");
      return;
    }

    console.log("Adding to cart with weight:", foodItem.weight);

    const cartItem = {
      id: id,
      name: foodItem.name,
      imageUrl: foodItem.images && foodItem.images.length > 0
        ? `http://localhost:8080/foods/image/${foodItem.images[0]}`
        : "/placeholder-image.jpg",
      flavor,
      weight: parseFloat(foodItem.weight), // Ensure weight is a number
      addOns,
      price: parseFloat(price),
      quantity: 1,
      totalPrice: parseFloat(price)
    };

    console.log("Cart item being added:", cartItem);

    const cart = JSON.parse(localStorage.getItem("cart")) || {};
    const itemKey = `${cartItem.id}_${cartItem.flavor}_${cartItem.weight}`; // Include weight in key

    if (cart[itemKey]) {
      cart[itemKey].quantity += 1;
      cart[itemKey].totalPrice = cart[itemKey].price * cart[itemKey].quantity;
    } else {
      cart[itemKey] = cartItem;
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));

    alert(
      `Added to cart: ${flavor} ${foodItem.name}, ${weight} pounds. Total Price: ${price} TK`
    );
  };


  // Add debug logging
  useEffect(() => {
    console.log("Current weight:", weight);
    console.log("Current price:", price);
  }, [weight, price]);

  const handleAddReview = () => {
    if (review.trim()) {
      setReviews([...reviews, review]);
      setReview("");
    }
  };


  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  if (!foodItem) return <div className="flex justify-center items-center h-screen">No food item found.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img
              src={`http://localhost:8080/foods/image/${foodItem.images?.[0]}`}
              alt={foodItem.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/placeholder-image.jpg";
              }}
            />
          </div>
          <CardContent className="md:w-1/2 p-6">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{foodItem.name}</CardTitle>
            </CardHeader>
            <p className="text-gray-600 mb-4">{foodItem.description}</p>
            
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Flavor:</label>
                <Select
                    value={foodItem.flavor[0].flavorName}
                    onValueChange={(selectedFlavor) => {
                      setFlavor(selectedFlavor);
                      const index = foodItem.flavor.findIndex((f) => f.flavorName === selectedFlavor);
                      setFlavorIx(index);
                    }}
                  >

                  <SelectTrigger className=" bg-white border border-gray-300 rounded-md shadow-md focus:ring focus:ring-indigo-200">
                    <SelectValue
                  placeholder="Select a flavor" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 shadow-lg rounded-md z-50">
                    {foodItem.flavor?.map((f, index) => (
                      <SelectItem key={index} value={f.flavorName || ""}>
                        {f.flavorName || "Unnamed Flavor"} - {f.price ? `${f.price} TK` : "Price not available"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <button
                className={`border rounded-lg shadow-lg p-2 hover:bg-gray-200 active:bg-gray-300 ml-1 
                  ${weight === foodItem.weight ? 'bg-blue-200' : ''}`}
              >
                {foodItem.weight} pound
              </button>
              <button
                className="border rounded-lg shadow-lg p-2 hover:bg-gray-200 active:bg-gray-300 ml-1"
               
              >
                Not available
              </button>

            
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 z-40">Weight (in pounds):</label>
                <Select value={weight.toString()} onValueChange={(value) => setWeight(Number(value))}>
                <SelectTrigger className=" bg-white border border-gray-300 rounded-md shadow-md focus:ring focus:ring-indigo-200">
                    <SelectValue placeholder="Select weight" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 shadow-lg rounded-md z-50">
                    {foodItem.weight?.map((w, index) => (
                      <SelectItem key={index} value={w.weight.toString()}>
                        {w.weight} pounds 
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}
              
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Add-Ons:</label>
                <div className="flex gap-4">
                  <div className="flex items-center">
                    <Checkbox id="extra-chocolate" onCheckedChange={() => toggleAddOn("Extra Chocolate")} />
                    <label htmlFor="extra-chocolate" className="ml-2 text-sm text-gray-700">Extra Chocolate</label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="extra-sprinkles" onCheckedChange={() => toggleAddOn("Extra Sprinkles")} />
                    <label htmlFor="extra-sprinkles" className="ml-2 text-sm text-gray-700">Extra Sprinkles</label>
                  </div>
                </div>
              </div> */}
              
              <p className="text-lg font-semibold">Total Price: {price} TK</p>
              
              <Button className="w-full" onClick={handleAddToCart}>Add to Cart</Button>
            </div>
          </CardContent>
        </div>
      </Card>
      
      <Card className="mt-8">
  <CardHeader>
    <CardTitle className="text-2xl font-bold">Customer Reviews</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
      <div className="flex items-center mb-4">
        <span className="mr-2">Rating:</span>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`focus:outline-none ${
                star <= rating ? 'text-yellow-400' : 'text-gray-300'
              }`}
            >
              <Star className="w-6 h-6 fill-current" />
            </button>
          ))}
        </div>
      </div>
      <Textarea
        placeholder="Share your experience with this product..."
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        className="mb-4 min-h-[100px]"
      />
      <Button 
        onClick={handleSubmitReview} 
        disabled={isSubmitting}
        className="w-full md:w-auto"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </Button>
    </div>

    <Separator className="my-6" />

    <div className="space-y-6">
      {reviews.length === 0 ? (
        <p className="text-center text-gray-500">No reviews yet. Be the first to review!</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-[#de7f45] flex items-center justify-center text-white font-semibold">
                {review.users?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="ml-3">
                <p className="font-semibold">
                  {userDetails[review.users?.id]?.name || review.users?.email || 'Anonymous User'}
                </p>
                <div className="flex items-center">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${
                          i < review.rating 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'fill-gray-200 text-gray-200'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
            {review.description && (
              <p className="text-gray-700 mt-2">{review.description}</p>
            )}
            <div className="mt-2 text-sm text-gray-500">
              Last updated: {new Date(review.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        ))
      )}
    </div>
  </CardContent>
</Card>
    </div>
  );
}