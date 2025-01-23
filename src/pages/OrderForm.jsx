import React, { useEffect, useState } from "react";
import axios from "axios";
import { Car } from "lucide-react";

const OrderForm = () => {
  const [cartItems, setCartItems] = useState([]);
  const [specialRequirements, setSpecialRequirements] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("ON_CASH");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [deliveryCharge, setDeliveryCharge] = useState(80.0);

  useEffect(() => {
    // Retrieve the cart items from localStorage
    const cartData = localStorage.getItem("cart");
    console.log("Cart Data", cartData);

    if (cartData) {
      // Parse the JSON string into an object
      const cart = JSON.parse(cartData);

      // Map the cart items to the required structure for the backend
      const updatedCartItems = Object.keys(cart).map(key => {
        const item = cart[key];

        if (typeof item === "object" && item.name) {
          return {
            foodId: item.id, // Extract foodId from the key
            quantity: item.quantity,
            flavorName: item.flavor, // Assuming `flavor` is the flavor name
            flavorPrice: item.price, // Assuming `price` is the flavor price
            weight: item.weight,
          };
        }
        return null;
      }).filter(item => item !== null); // Remove null items

      setCartItems(updatedCartItems); // Set the updated cart items
    } else {
      console.log("No cart data found.");
    }
  }, []);

  // In OrderForm.jsx
useEffect(() => {
  console.log("Cart items with weights:", cartItems.map(item => ({
    name: item.flavorName,
    weight: item.weight,
    parsedWeight: parseFloat(item.weight)
  })));
}, [cartItems]);

  console.log("paymentMethod", paymentMethod);
  console.log("deliveryTime", deliveryTime);
  console.log("specialRequirements", specialRequirements);
  console.log("deliveryCharge", deliveryCharge);
  console.log("cartItems", cartItems);

  // Log each cart item's details including quantity
cartItems.forEach((item, index) => {
  console.log(`Cart Item ${index + 1}:`);
  console.log("foodId:", item.foodId);
  console.log("flavorName:", item.flavorName);
  console.log("flavorPrice:", item.flavorPrice);
  console.log("weight:", item.weight);
  console.log("quantity:", item.quantity);  // Add quantity here
});

const handleOrderSubmit = async () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    alert("No authentication token found");
    return;
  }

  console.log("Submitting order...");
  console.log("token", token);  
  
  const decodedToken = JSON.parse(atob(token.split(".")[1])); 

  

  // Format the order DTO to match backend exactly
  const orderDto = {
    orderItems: cartItems.map(item => ({
      foodId: item.foodId,
      quantity: parseInt(item.quantity),
      flavorName: item.flavorName,
      flavorPrice: parseFloat(item.flavorPrice),
      weight: parseFloat(item.weight)
    })),
    specialRequirements: specialRequirements,
    deliveryCharge: parseFloat(deliveryCharge),
    deliveryTime: new Date(deliveryTime).toISOString(), // Ensure proper datetime format
    paymentMethod: paymentMethod
  };
  
  console.log("Sending Order DTO:", JSON.stringify(orderDto, null, 2));

  
  try {
    const response = await axios({
      method: 'post',
      url: 'http://localhost:8080/customer/createOrder',
      data: orderDto,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    
    if (response.status === 200 || response.status === 201) {
      alert("Order placed successfully!");
      localStorage.removeItem('cart');
    }
  } catch (error) { if (error.response) {

    console.error("Server Error:", error.response.data);
    alert(`Error: ${error.response.data.message || 'Failed to place order'}`);
    
    if (error.response.status === 403) {
      alert("You don't have permission to place orders. Please login as a customer.");
    } else if (error.response.status === 401) {
      alert("Your session has expired. Please login again.");
      localStorage.removeItem('access_token');
    }
  } else if (error.request) {
    
    console.error("Network Error:", error.request);
    alert("Unable to connect to the server. Please check your internet connection.");
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("Error:", error.message);
    alert("An error occurred while processing your request.");
  }
  }
};
    

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Review Your Order</h2>
      <ul className="mb-4 space-y-2">
        {Array.isArray(cartItems) && cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <li key={index} className="bg-gray-100 p-2 rounded-md">
              <span className="font-semibold">{item.name}</span>
              <span className="font-semibold">{item.flavorName}</span> - {item.quantity} x {item.flavorPrice}Tk ({item.weight}pound)
            </li>
          ))
        ) : (
          <p className="text-gray-500">No items in cart.</p>
        )}
      </ul>
      <div className="mb-4">
        <label className="block font-medium">Delivery Time:</label>
        <input
          type="datetime-local"
          value={deliveryTime}
          onChange={(e) => setDeliveryTime(e.target.value)} // This will handle the datetime input
          className="w-full p-2 border rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium">Payment Method:</label>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full p-2 border rounded-md">
          <option value="ON_CASH">ON_CASH</option>
          <option value="ONLINE">ONLINE</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium">Special Requirements:</label>
        <input type="text" value={specialRequirements} onChange={(e) => setSpecialRequirements(e.target.value)} className="w-full p-2 border rounded-md" />
      </div>
      <button onClick={handleOrderSubmit} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300">
        Place Order
      </button>
    </div>
  );
};

export default OrderForm;
