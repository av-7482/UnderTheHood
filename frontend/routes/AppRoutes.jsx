import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login.jsx";
import Home from "../pages/Home.jsx";
import Register from "../pages/Register.jsx";
import Community from "../pages/Community.jsx";
import AddCommunity from "../pages/AddCommunity.jsx";
import CommunityArticle from "../pages/CommunityArticle.jsx";
import ComponentDetails from "../pages/ComponentDetail.jsx";
import AddComponent from "../pages/AddComponent.jsx";
import Components from "../pages/Components.jsx";
import AddComputer from "../pages/AddComputer.jsx";
import Computers from "../pages/Computers.jsx";
import ComputerDetails from "../pages/ComputerDetail.jsx";
import UpdateItem from "../pages/Update.jsx";
import Wishlist from "../pages/Wishlist.jsx";
import DeleteItem from "../pages/Delete.jsx";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/community" element={<Community />} />
            <Route path="/admin/community/add" element={<AddCommunity />} />
            <Route path="/community/:id" element={<CommunityArticle />} />
            <Route path="/components/:id" element={<ComponentDetails />} />
            <Route path="/admin/component/add" element={<AddComponent />} />
            <Route path="/components" element={<Components />} />
            <Route path="/admin/computer/add" element={<AddComputer />} />
            <Route path="/computers" element={<Computers />} />
            <Route path="/computers/:id" element={<ComputerDetails />} />
            <Route path="/admin/update" element={<UpdateItem />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/admin/delete" element={<DeleteItem />} />
        </Routes>
    );
}
export default AppRoutes;