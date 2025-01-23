"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const OrdersContent = () => {
  const [orders, setOrders] = useState([])
  const [token,setToken]=useState(localStorage.getItem("access_token"))

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    if (!token) {
      alert("No authentication token found");
      return;
    }
    
  console.log("token", token);  
  
    try {
      const response = await fetch("http://localhost:8080/admin/orders-by-status?status=PENDING&sortByDateTime=true")
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error("Error fetching orders:", error)
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:8080/admin/updateOrderStatus?orderId=${orderId}&status=${newStatus}`,
        {
          method: "POST",
        },
      )
      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) => (order.id === orderId ? { ...order, orderStatus: newStatus } : order)),
        )
      } else {
        console.error("Failed to update order status")
      }
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Order Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="w-full max-w-3xl">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                    <p className="text-sm text-gray-600">User ID: {order.userId}</p>
                    <p className="text-sm text-gray-600">
                      Items:{" "}
                      {order.orderItems
                        .map((item) => `${item.quantity}x ${item.flavorName} (${item.weight}kg)`)
                        .join(", ")}
                    </p>
                    <p className="text-sm text-gray-600">Total: ${order.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">
                      Delivery Time: {new Date(order.deliveryTime).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Payment Method: {order.paymentMethod}</p>
                    <p className="text-sm text-gray-600">Special Requirements: {order.specialRequirements}</p>
                  </div>
                  <div>
                    <Select
                      defaultValue={order.orderStatus}
                      onValueChange={(value) => handleStatusChange(order.id, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="ON_PROGRESS">On Progress</SelectItem>
                        <SelectItem value="SHIPPED">Shipped</SelectItem>
                        <SelectItem value="DELIVERED">Delivered</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default OrdersContent

