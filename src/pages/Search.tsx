import { useState } from "react";
import ProductCard from "../components/productCard";
import {
  useCategoriesQuery,
  useSearchProductsQuery,
} from "../redux/api/productAPI";
import toast from "react-hot-toast";
import { customError } from "../types/apiTypes";
import { Skeleton } from "../components/Loader";
import { cartItem } from "../types/types";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";
const Search = () => {
  const {
    data: categoriesResponse,
    isLoading: loadingCategeories,
    isError,
    error,
  } = useCategoriesQuery("");

  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [page, setPage] = useState(1);

  const {
    isLoading: productLoading,
    data: searchedData,
    isError: productIsError,
    error: productError,
  } = useSearchProductsQuery({
    search,
    sort,
    page,
    category,
    price: maxPrice,
  });

  if (isError) {
    const err = error as customError;
    toast.error(err.data.message);
  }

  if (productIsError) {
    const err = productError as customError;
    toast.error(err.data.message);
  }

  const isPrevPage = page > 1;
  const isNextPage = page < 4;

  const dispatch = useDispatch();

  const addToCartHandler = (cartItem: cartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of stock");

    dispatch(addToCart(cartItem));
    toast.success("Added to cart!");
  };

  return (
    <div className="product-search-page">
      <aside>
        <h2>Filters</h2>
        <div>
          <h2>sort</h2>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">None</option>
            <option value="asc">Price (Low to High)</option>
            <option value="dsc">Price (High to Low)</option>
          </select>
        </div>

        <div>
          <h2>Max Price : {maxPrice || ""}</h2>
          <input
            type="range"
            min={100}
            max={1000000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>

        <div>
          <h2>Category</h2>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All</option>
            {!loadingCategeories &&
              categoriesResponse?.categories.map((i) => (
                <option key={i} value={i}>
                  {i.toUpperCase()}
                </option>
              ))}
          </select>
        </div>
      </aside>

      <main>
        <h1>Products</h1>
        <input
          type="text"
          name="search"
          value={search}
          placeholder="Search Products"
          onChange={(e) => setSearch(e.target.value)}
        />

        {productLoading ? (
          <Skeleton length={10} />
        ) : (
          <div className="search-product-list">
            {searchedData?.products.map((i) => (
              <ProductCard
                key={i._id}
                productId={i._id}
                name={i.name}
                price={i.price}
                photo={i.photo}
                stock={i.stock}
                handler={addToCartHandler}
              />
            ))}
          </div>
        )}
        {/* moving to next page */}
        {searchedData && searchedData.totalPage > 1 && (
          <article>
            <button
              disabled={!isPrevPage}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous Page
            </button>
            <span>
              {page} of {searchedData.totalPage}
            </span>
            <button
              disabled={!isNextPage}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next Page
            </button>
          </article>
        )}
      </main>
    </div>
  );
};

export default Search;
