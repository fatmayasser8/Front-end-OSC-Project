import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";

import Auth from "./pages/AuthPage/Auth";
import Login from "./pages/AuthPage/Login";
import Register from "./pages/AuthPage/Register";
import Navbar from "./components/Navbar/navbar"
import SearchBar from "./components/searchBar/searchBar"
import Card from "./components/propertyCard/propertyCard"
import Home from "./pages/Home/home"; 
import Profile from "./pages/profile/Profile"; 
import PropertyDetails from "./pages/propertyDetails/PropertyDetails"; 
import SellerDashboard from "./pages/sellerDashboard/SellerDashboard";
import Favorites from "./pages/favourites/Favourites";
import Validation from "./pages/validation/Validation";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/auth" element={<Auth />}>

          <Route index element={<Navigate to="login" replace />} />

          <Route  path="login" element={<Login />} />

          <Route path="register" element={<Register />} />

        </Route>
<Route path="/home" element={<Home />}></Route>

<Route path="/profile" element={<Profile />} /> 
<Route path="/propertyDetails" element={<PropertyDetails />} /> 
<Route path="/sellerDashBoard" element={<SellerDashboard />} /> 
<Route path="/favorites" element={<Favorites />} /> 
<Route path="/validation" element={<Validation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;



