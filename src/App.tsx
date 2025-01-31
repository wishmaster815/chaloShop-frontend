import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./styles/app.scss";
// we are using lazy function from react. jab hum /cart par gaye hi nahi toh pehle se kholne ka mtlb ni hai toh isliye lazy fucntion use karte hai
import { lazy, Suspense, useEffect } from "react";
import Loader from "./components/Loader";
import Header from "./components/header";

import { Toaster } from "react-hot-toast";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useDispatch, useSelector } from "react-redux";
import { userExists, userNotExists } from "./redux/reducer/userReducer";
import { getUser } from "./redux/api/userAPI";
import { userReducerInitialStateTypes } from "./types/reducerTypes";
import ProtectedRoute from "./components/protectedRoute";

const NotFound = lazy(() => import("./pages/not-found"));
const Home = lazy(() => import("./pages/Home"));
const Search = lazy(() => import("./pages/Search"));
const Cart = lazy(() => import("./pages/Cart"));
const Shipping = lazy(() => import("./pages/Shipping"));
const RazorpayCheckout = lazy(() => import("./pages/checkout"));
const Orders = lazy(() => import("./pages/Orders"));
// user not logged in route
const Login = lazy(() => import("./pages/Login"));

// admin dashboard imports
const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const Products = lazy(() => import("./pages/admin/products"));
const Customers = lazy(() => import("./pages/admin/customers"));
const Transaction = lazy(() => import("./pages/admin/transaction"));
const Barcharts = lazy(() => import("./pages/admin/charts/barcharts"));
const Piecharts = lazy(() => import("./pages/admin/charts/piecharts"));
const Linecharts = lazy(() => import("./pages/admin/charts/linecharts"));
const Coupon = lazy(() => import("./pages/admin/apps/coupon"));
const Stopwatch = lazy(() => import("./pages/admin/apps/stopwatch"));
const Toss = lazy(() => import("./pages/admin/apps/toss"));
const NewProduct = lazy(() => import("./pages/admin/management/newproduct"));
const ProductManagement = lazy(
  () => import("./pages/admin/management/productmanagement")
);
const TransactionManagement = lazy(
  () => import("./pages/admin/management/transactionmanagement")
);

const App = () => {
  const { user, loading } = useSelector(
    (state: { userReducer: userReducerInitialStateTypes }) => state.userReducer
  );

  return signOut(auth).then(() => console.log("done"));

  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const data = await getUser(user.uid);
        dispatch(userExists(data.user));
      } else {
        dispatch(userNotExists());
      }
    });
    return () => {};
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <Router>
      {/* Header  */}
      <Header user={user} />
      {/* suspense hook is used when we want to show something prier to what is the actual thing */}
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/login"
            element={
              <ProtectedRoute isAuthenticated={user ? false : true}>
                <Login />
              </ProtectedRoute>
            }
          />
          {/* logged in user routes */}
          <Route
            element={<ProtectedRoute isAuthenticated={user ? true : false} />}
          >
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/pay" element={<RazorpayCheckout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order/:id" element={<Orders />} />
          </Route>
          {/* admin routes */}
          {/* admin routes */}
          <Route
            element={
              <ProtectedRoute
                isAuthenticated={true}
                adminOnly={true}
                admin={user?.role === "admin" ? true : false}
              />
            }
          >
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/product" element={<Products />} />
            <Route path="/admin/customer" element={<Customers />} />
            <Route path="/admin/transaction" element={<Transaction />} />
            {/* Charts */}
            <Route path="/admin/chart/bar" element={<Barcharts />} />
            <Route path="/admin/chart/pie" element={<Piecharts />} />
            <Route path="/admin/chart/line" element={<Linecharts />} />
            {/* Apps */}
            <Route path="/admin/app/coupon" element={<Coupon />} />
            <Route path="/admin/app/stopwatch" element={<Stopwatch />} />
            <Route path="/admin/app/toss" element={<Toss />} />

            {/* Management */}
            <Route path="/admin/product/new" element={<NewProduct />} />

            <Route path="/admin/product/:id" element={<ProductManagement />} />

            <Route
              path="/admin/transaction/:id"
              element={<TransactionManagement />}
            />
          </Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </Suspense>
      <Toaster position="bottom-center" />
    </Router>
  );
};

export default App;
