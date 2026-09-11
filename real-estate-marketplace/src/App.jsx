import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Auth from "./pages/AuthPage/Auth";
import Login from "./pages/AuthPage/Login";
import Register from "./pages/AuthPage/Register";

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



import Dashboard from "./pages/adminDashboard";

function App() {
  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/auth" element={<Auth />}>
          <Route index element={<Navigate to="login" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        <Route path="/home" element={<Home />} />

        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />

        <Route path="/profile" element={<Profile />} />

        <Route
          path="/propertyDetails"
          element={<PropertyDetails />}
        />

        <Route
          path="/sellerDashBoard"
          element={<SellerDashboard />}
        />

        <Route path="/favorites" element={<Favorites />} />

        <Route path="/validation" element={<Validation />} />

        <Route path="/adminDashBoard" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
<Route
  path="/reset-password"
  element={<ResetPassword />}
/>

<Route path="/sell-property" element={<SellProperty />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;