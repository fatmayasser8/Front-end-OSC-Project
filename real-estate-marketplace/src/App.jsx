import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/landing";
import Auth from "./pages/AuthPage/Auth";
import Login from "./pages/AuthPage/Login";
import Register from "./pages/AuthPage/Register";
import ProtectedRoute from "./routes/ProtectedRoute";

import Navbar from "./components/Navbar/navbar";
import SearchBar from "./components/searchBar/searchBar";
import Card from "./components/propertyCard/propertyCard";

import Home from "./pages/Home/home";
import Contact from "./pages/Home/contact";
import About from "./pages/Home/about";

import Profile from "./pages/profile/Profile";
import PropertyDetails from "./pages/propertyDetails/PropertyDetails";
import SellerDashboard from "./pages/sellerDashboard/SellerDashboard";
import Favorites from "./pages/favourites/Favourites";
import Validation from "./pages/validation/Validation";
import ResetPassword from "./pages/AuthPage/ResetPassword";
import SellProperty from "./pages/SellProperty/SellProperty";

import ErrorPage from "./pages/ErrorPage/ErrorPage"; 
import NotFound from "./pages/NotFound/NotFound";

import AdminRoute from "./routes/AdminRoute"
import Dashboard from "./pages/adminDashboard";
import Layout from "./components/footer/footer";
function App() {
  return (
    
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
        <Route path="/" element={<Landing />} />

        <Route path="/auth" element={<Auth />}>
          <Route index element={<Navigate to="login" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        <Route path="/home" element={<Home />} />

        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />

<Route
  path="/property/:id"
  element={<PropertyDetails />}
/>

{/* ========================= PROTECTED ROUTES ========================= */}
 <Route element={<ProtectedRoute />}>
  <Route path="/profile" element={<Profile />} />
  <Route path="/favorites" element={<Favorites/>} /> 
  <Route path="/seller-dashboard" element={<SellerDashboard />} /> 
  </Route>

        

  

        <Route path="/validation" element={<Validation />} />

   <Route element={<AdminRoute />}>
         <Route path="/adminDashBoard" element={<Dashboard />} />
   </Route>
        <Route path="/dashboard" element={<Dashboard />} />
<Route
  path="/reset-password"
  element={<ResetPassword />}
/>

<Route
  path="/sell-property"
  element={<SellProperty />}
/>

<Route
  path="/edit-property/:id"
  element={<SellProperty />}
/>


{/* ========================= ERROR PAGE ========================= */}
 <Route path="/error" element={<ErrorPage />} /> 

 {/* ========================= 404 ========================= */}

  <Route path="*" element={<NotFound />} />

</Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;