import Nav from "./components/Nav";
import Footer from "./components/Footer";
import { Home } from "./pages";
import { Route, Routes } from "react-router-dom";
import CategoryDetail from "./pages/CategoryDetail";
import ScrollToTop from "./utils/ScrollToTop";
import FoodDetail from "./pages/FoodDetail"; 
import "./index.css";
import UserProfile from "./pages/UserProfile";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import Cart from "./pages/Cart";
import AddFood from "./pages/AddFood";
import OrderForm from "./pages/OrderForm";
import RegisterPage from "./pages/RegisterPage";
import OrdersPage from "./pages/OrderPage";
import PP from "./pages/PP";
import BlogList from "./pages/BlogList";

const App = () => {
  return (
    <>
      <div className="relative">
        <div className="absolute top-0 z-[-2] bg-white bg-[radial-gradient(100%_70%_at_70%_0%,rgba(0,163,255,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]"></div>
        <ScrollToTop />
        <Nav />
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:category_name" element={<CategoryDetail />} />
        <Route path="/detail/:id" element={<FoodDetail />} />
        <Route path="/profile" element={<PP />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard/>} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/add" element={<AddFood/>} />
        <Route path='/order' element={<OrderForm/>} />
        <Route path='/register' element={<RegisterPage/>} />
        <Route path="/order_" element={<OrdersPage/>}/>
        <Route path="/blogshow" element={<BlogList/>}/>
        </Routes>

        
        <Footer />
      </div>
    </>
  );
};

export default App;
