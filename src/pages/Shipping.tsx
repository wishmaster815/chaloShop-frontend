import { ChangeEvent, useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";

const Shipping = () => {
  const { cartItems } = useSelector((state: RootState) => state.cartReducer);
  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  });

  const navigate = useNavigate();

  //   const changehandler = (e: ChangeEvent<HTMLInputElement>) => {};
  const changehandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setShippingAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    if (cartItems.length <= 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  return (
    <div className="shipping">
      <button
        className="back-btn"
        onClick={() => {
          navigate("/cart");
        }}
      >
        <BiArrowBack />
      </button>

      <form>
        <h1>Shipping address</h1>

        <input
          required
          type="text"
          placeholder="Address"
          name="address"
          value={shippingAddress.address}
          onChange={changehandler}
        />

        <input
          required
          type="text"
          placeholder="City"
          name="city"
          value={shippingAddress.city}
          onChange={changehandler}
        />
        <input
          required
          type="text"
          placeholder="State"
          name="state"
          value={shippingAddress.state}
          onChange={changehandler}
        />
        <select
          name="country"
          required
          value={shippingAddress.country}
          onChange={changehandler}
        >
          <option value="">Select Country</option>
          <option value="india">India</option>
        </select>

        <input
          required
          type="number"
          placeholder="Pincode"
          name="pinCode"
          value={shippingAddress.pinCode}
          onChange={changehandler}
        />
        <button type="submit">Pay Now</button>
      </form>
    </div>
  );
};

export default Shipping;
