import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/landing" ;
import Auth from "./pages/AuthPage/Auth";
import Login from "./pages/AuthPage/Login";
import Register from "./pages/AuthPage/Register";

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

      </Routes>
    </BrowserRouter>
  );
}

export default App;