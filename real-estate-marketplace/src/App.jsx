import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";

import Auth from "./pages/AuthPage/Auth";
import Login from "./pages/AuthPage/Login";
import Register from "./pages/AuthPage/Register";
import Navbar from "./components/Navbar/navbar"
import SearchBar from "./components/searchBar/searchBar"
import Card from "./components/propertyCard/propertyCard"
import Home from "./pages/Home/home"; 


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




      </Routes>
    </BrowserRouter>
  );
}

export default App;