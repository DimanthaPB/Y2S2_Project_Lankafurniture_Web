import React from 'react';
import {BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLoginPage from './pages/Finance/AdminLoginPage';
import AdminDashboardPage from './pages/Finance/AdminDashboardPage';
import EmployeesPage from './pages/Finance/AdminEmployeesPage';
import SalariesPage from './pages/Finance/AdminSalariesPage';
import Home from './pages/Home';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminUsersPage from "./pages/Finance/AdminUsersPage";

import Inventory from "./components/Inventory/Inventory";
import Dashboard from "./components/Inventory/InvDashboard";
import Report from "./components/Inventory/Report";
import "./components/Inventory/Inventory.css";

import ServiceProviderDashboard from './components/SerProvider/ServiceProviderDashboard';
import NewArrivals from './components/SerProvider/newArrivals/newArrivals';
import ProjectsList from './components/SerProvider/ProjectsList';
import TransactionsList from './components/SerProvider/TransactionsList';
import RatingsList from './components/SerProvider/RatingsList';
import TestDataForm from './Components/testdata/TestDataForm';
import JobAdd from './components/SerProvider/JobAdd'
import CreateProject from './components/SerProvider/Projects/CreateProject';
import EditProject from './components/SerProvider/Projects/EditProject';

import ShopPage from './components/Shop/ShopPage';
import { Toaster } from 'react-hot-toast';
import CartPage from './components/Cart/CartPage';
import MyOrders from './components/Orders/MyOrders';
import OrderDashboard from './pages/OrderDashboard/OrderDashboard';

import ClientLayout from "./layouts/ClientLayout";
import AdminLayout from "./layouts/AdminLayout";
import DeliHome from "./pages/Delivery/client/DeliHome";
import TrackOrder from "./pages/Delivery/client/TrackOrder";
import FeedbackForm from "./pages/Delivery/client/FeedbackForm";
import TeamReviews from "./pages/Delivery/client/TeamReviews";
import NotFound from "./pages/Delivery/common/NotFound";

// Admin Pages
import DeliDashboard from "./pages/Delivery/admin/Dashboard";
import Teams from "./pages/Delivery/admin/Teams";
import Members from "./pages/Delivery/admin/Members";
import Tracking from "./pages/Delivery/admin/Tracking";
import Feedback from "./pages/Delivery/admin/Feedback";
import Profile from './pages/Profile';


const App = () => {
  return (
   <>
    <Toaster position="top-right" />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin/users" element={<AdminUsersPage />} />

      <Route path="/adminLogin" element={<AdminLoginPage />} />
      <Route path="/adminDashboard" element={<AdminDashboardPage />} />
      <Route path="/employees" element={<EmployeesPage />} />
      <Route path="/salaries/:employeeId" element={<SalariesPage />} />
      <Route path="/api/salaries/:id"></Route>
      <Route path="/api/employees/report" element={<EmployeesPage />} />

      <Route path="/inventory" element={<Inventory />} />
      <Route path="/invDashboard" element={<Dashboard />} />
      <Route path="/report" element={<Report />} />

      <Route path="/serviceproviderdashboard/provider123" element={<ServiceProviderDashboard />} />
      <Route path="/newArrivals" element={<NewArrivals />} />
      <Route path="/provider/:id/projects" element={<ProjectsList />} />
      <Route path="/provider/:id/projects/new" element={<CreateProject />} />
      <Route path="/provider/:id/projects/:projectId/edit" element={<EditProject />} />
      <Route path="/provider/:id/transactions" element={<TransactionsList />} />
      <Route path="/provider/:id/ratings" element={<RatingsList />} />
      <Route path="/jobAdd" element={<JobAdd />} />

      <Route path="/test-data" element={<TestDataForm />} />
      
      <Route path='/shop' element={<ShopPage />} />
      <Route path='/cart' element={<CartPage />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/my-orders' element={<MyOrders />} />
      
      <Route path='/order-dashboard' element={<OrderDashboard />} />

      <Route path="deliHome" element={<DeliHome />} />
      <Route path="track" element={<TrackOrder />} />
      <Route path="feedback" element={<FeedbackForm />} />
      <Route path="reviews/:teamId" element={<TeamReviews />} />

      <Route path="/deliDashboard" element={<AdminLayout />}>
        <Route index element={<DeliDashboard />} />
        <Route path="teams" element={<Teams />} />
        <Route path="members" element={<Members />} />
        <Route path="tracking" element={<Tracking />} />
        <Route path="feedback" element={<Feedback />} />
      </Route>


    </Routes>
   </>
  );
};

export default App;
