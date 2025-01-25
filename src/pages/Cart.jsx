import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

const Cart = () => {
  const [cart, setCart] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const cartData = localStorage.getItem("cart");
    if (cartData) {
      const parsedCart = JSON.parse(cartData);
      setCart(parsedCart);
      calculateTotal(parsedCart);
    }
  }, []);

  const calculateTotal = (cartItems) => {
    const total = Object.values(cartItems).reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    setTotalPrice(total);
  };

  const updateQuantity = (itemKey, newQuantity) => {
  if (newQuantity < 1) return;

  const updatedCart = { ...cart };
  updatedCart[itemKey].quantity = newQuantity;
  updatedCart[itemKey].totalPrice = updatedCart[itemKey].price * newQuantity;
  // Ensure weight is at least 1.5
  updatedCart[itemKey].weight = Math.max(1.5, parseFloat(updatedCart[itemKey].weight));

  setCart(updatedCart);
  localStorage.setItem("cart", JSON.stringify(updatedCart));
  calculateTotal(updatedCart);
  window.dispatchEvent(new Event('cartUpdated'));
};

  const removeItem = (itemKey) => {
    const updatedCart = { ...cart };
    delete updatedCart[itemKey];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const clearCart = () => {
    setCart({});
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event('cartUpdated'));
    setTotalPrice(0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      {Object.keys(cart).length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Link to="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {Object.entries(cart).map(([itemKey, item]) => (
              <Card key={itemKey} className="p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                    onError={(e) => {
                      e.target.src = "/placeholder-image.jpg";
                    }}
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      Flavor: {item.flavor}
                    </p>
                    <p className="text-sm text-gray-600">
                      Weight: {item.weight} pounds
                    </p>
                    {item.addOns && item.addOns.length > 0 && (
                      <p className="text-sm text-gray-600">
                        Add-ons: {item.addOns.join(", ")}
                      </p>
                    )}
                    <p className="text-sm font-semibold">
                      Price: {item.price} TK
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateQuantity(itemKey, item.quantity - 1)
                      }
                    >
                      -
                    </Button>
                    <span className="mx-2">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateQuantity(itemKey, item.quantity + 1)
                      }
                    >
                      +
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeItem(itemKey)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-lg">{totalPrice} TK</span>
            </div>
            <div className="flex justify-between gap-4">
              <Button variant="outline" onClick={clearCart}>
                Clear Cart
              </Button>
              <Link to="/order">
                <Button>Proceed to Checkout</Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;