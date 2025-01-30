import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { Skeleton } from "../../components/Loader";
import { useAllOrdersQuery } from "../../redux/api/orderAPI";
import { RootState } from "../../redux/store";
import { customError } from "../../types/apiTypes";

interface DataType {
  user: string;
  amount: number;
  discount: number;
  quantity: number;
  status: ReactElement;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "user",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Transaction = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const { data, isLoading, isError, error } = useAllOrdersQuery(user?._id!);
  const [rows, setRows] = useState<DataType[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showCheckout, setShowCheckout] = useState<boolean>(false);
  const [shippingAddress, setShippingAddress] = useState<string>("");
  const navigate = useNavigate();

  if (isError) {
    const err = error as customError;
    toast.error(err.data.message);
  }

  useEffect(() => {
    if (data && data.orders) {
      setRows(
        data.orders.map((i) => ({
          user: i.user.name,
          amount: i.total,
          discount: i.discount,
          quantity: i.orderItems.length,
          status: (
            <span
              className={
                i.status === "Processing"
                  ? "red"
                  : i.status === "Shipped"
                  ? "green"
                  : "purple"
              }
            >
              {i.status}
            </span>
          ),
          action: (
            <>
              <Link to={`${i._id}`}>Manage</Link>
              <button
                onClick={() => handleCheckout(i)}
                className="checkout-button"
              >
                Checkout
              </button>
            </>
          ),
        }))
      );
    } else {
      setRows([]); // Reset rows if no orders are available
    }
  }, [data]);

  const handleCheckout = (order: any) => {
    setSelectedOrder(order);
    setShowCheckout(true);
  };

  const handlePayment = async () => {
    if (!shippingAddress) {
      toast.error("Please enter a shipping address");
      return;
    }

    // Proceed with Razorpay payment
    const paymentData = {
      amount: selectedOrder.total,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      shippingAddress,
    };

    try {
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

      const options = {
        key: "rzp_test_94M2K5ZpsO1bsm", // Replace with your Razorpay test/live key
        amount: order.amount.toString(),
        currency: "INR",
        name: "chaloShop",
        description: "Test Transaction",
        order_id: order.id,
        handler: async (response: any) => {
          const paymentDetails = response;
          console.log("Payment successful:", paymentDetails);
          toast.success("Payment successful");
          navigate("/orders");
        },
        prefill: {
          name: "Customer",
          email: "customer@example.com",
        },
        theme: {
          color: "#F37254",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error creating payment order");
    }
  };

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Transactions",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>
        {isLoading ? (
          <Skeleton key={15} />
        ) : (
          <>
            {Table}
            {showCheckout && (
              <div className="checkout-modal">
                <h3>Enter Shipping Address</h3>
                <textarea
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Enter your shipping address"
                />
                <button onClick={handlePayment}>Pay Now</button>
                <button onClick={() => setShowCheckout(false)}>Cancel</button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Transaction;
