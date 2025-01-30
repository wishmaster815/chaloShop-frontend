import { FaPlus } from "react-icons/fa";
import { server } from "../redux/store";
import { cartItem } from "../types/types";

type ProductsProps = {
  productId: string;
  name: string;
  price: number;
  photo: string;
  stock: number;
  handler: (cartItem: cartItem) => string | undefined;
};

// const server  = " enonefnsf"

const ProductCard = ({
  productId,
  name,
  price,
  photo,
  stock,
  handler,
}: ProductsProps) => {
  return (
    <div className="product-card">
      <img src={`${server}/${photo}`} alt={name} />
      <p>{name}</p>
      <span> ₹{price} </span>

      <div>
        <button
          onClick={() =>
            handler({ productId, price, name, photo, stock, quantity: 1 })
          }
        >
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
