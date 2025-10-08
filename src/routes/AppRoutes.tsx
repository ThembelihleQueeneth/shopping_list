import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { Home } from "../pages/Home";
import { ListDetails } from "../pages/ListDetails";
import { ProfilePage } from "../pages/ProfilePage";
import { ViewItems } from "../components/ViewItems";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home/>} />
        <Route path="/details" element={<ListDetails/>} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/lists/:listId" element={<ViewItems />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
