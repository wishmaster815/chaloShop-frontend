import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState, server } from "../redux/store";

declare global {
  interface Window {
    Razorpay: any; // Define Razorpay globally
  }
}

const RazorpayCheckout = () => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [totalAmount, setTotalAmount] = useState<number | null>(null); // Store fetched amount
  const [shippingAddress, setShippingAddress] = useState<string>(""); // Store shipping address
  const navigate = useNavigate();

  // Fetch total order amount from backend
  const { user } = useSelector((state: RootState) => state.userReducer);
  useEffect(() => {
    const fetchOrderAmount = async () => {
      try {
        const response = await fetch(`${server}/api/v1/order/my?id=01`, {
          method: "GET", // Replace with appropriate method
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch order amount");
        }

        const data = await response.json();
        if (data.success && data.orders.length > 0) {
          const total = data.orders[0].total; // Extract the total amount
          setTotalAmount(total); // Convert INR to paise
        } else {
          throw new Error("No orders found for the user");
        }
      } catch (error) {
        console.error("Error fetching order amount:", error);
        toast.error("Error fetching order amount");
      }
    };

    fetchOrderAmount();
  }, [user?._id]);

  const handlePayment = async () => {
    if (!totalAmount) {
      toast.error("Unable to fetch order amount");
      return;
    }

    if (!shippingAddress) {
      toast.error("Please enter a shipping address");
      return;
    }

    setIsProcessing(true);

    // Data to send to backend for Razorpay order creation
    const paymentData = {
      amount: totalAmount, // Use the fetched amount
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      shippingAddress, // Include shipping address
    };

    try {
      // Send a POST request to the backend to create the Razorpay order
      const response = await fetch(
        "http://localhost:4000/api/v1/payment/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create payment order");
      }

      const data = await response.json();
      const { order } = data;

      // Prepare Razorpay options
      const options = {
        key: "rzp_test_94M2K5ZpsO1bsm", // Replace with your Razorpay test/live key
        amount: order.amount.toString(), // Amount in smallest unit (paise for INR)
        currency: "INR",
        name: "chaloShop",
        description: "Test Transaction",
        order_id: order.id, // Order ID from the backend
        handler: async (response: any) => {
          const paymentDetails = response;

          // Handle successful payment (send data to the backend, etc.)
          console.log("Payment successful:", paymentDetails);

          // Call your backend to verify and save the payment details (optional)
          toast.success("Payment successful");
          navigate("/orders");
        },
        prefill: {
          name: user?.name || "Customer", // Pre-fill customer name dynamically
          email: user?.email || "customer@example.com", // Pre-fill customer email dynamically
        },
        theme: {
          color: "#F37254", // Customize the theme color
        },
      };

      // Initialize Razorpay and open the payment modal
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error creating payment order");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="checkout-container">
      <h3>Total Amount: ₹{totalAmount ? totalAmount / 100 : "Loading..."}</h3>
      <div className="shipping-address">
        <label htmlFor="shippingAddress">Shipping Address</label>
        <textarea
          id="shippingAddress"
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          placeholder="Enter your shipping address"
          rows={4}
        />
      </div>
      <button onClick={handlePayment} disabled={isProcessing || !totalAmount}>
        {isProcessing ? "Processing..." : "Pay with Razorpay"}
      </button>
    </div>
  );
};

export default RazorpayCheckout;
