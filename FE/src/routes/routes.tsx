import type { RouteObject } from "react-router-dom";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Favorites from "@/pages/Favorites";
import RestaurantDetail from "@/pages/RestaurantDetail";
import Profile from "@/pages/Profile";
import OwnerDashboard from "@/pages/OwnerDashboard";
import OwnerEdit from "@/pages/OwnerEdit";
import OwnerNewDish from "@/pages/OwnerNewDish";
import OwnerRestaurants from "@/pages/OwnerRestaurants";
import OwnerEvents from "@/pages/OwnerEvents";
import OwnerReviews from "@/pages/OwnerReviews";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminUsers from "@/pages/AdminUsers";
import UserManagement from "@/pages/UserManagement";
import ReportManagement from "@/pages/ReportManagement";

export const routes: RouteObject[] = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/favorites",
    element: (
      <ProtectedRoute>
        <Favorites />
      </ProtectedRoute>
    ),
  },
  {
    path: "/restaurant/:id",
    element: <RestaurantDetail />,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/manage",
    element: (
      <ProtectedRoute requiredRoles={["OWNER"]}>
        <OwnerDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/manage/restaurants",
    element: (
      <ProtectedRoute requiredRoles={["OWNER"]}>
        <OwnerRestaurants />
      </ProtectedRoute>
    ),
  },
  {
    path: "/manage/edit",
    element: (
      <ProtectedRoute requiredRoles={["OWNER"]}>
        <OwnerEdit />
      </ProtectedRoute>
    ),
  },
  {
    path: "/manage/new-dish",
    element: (
      <ProtectedRoute requiredRoles={["OWNER"]}>
        <OwnerNewDish />
      </ProtectedRoute>
    ),
  },
  {
    path: "/manage/events",
    element: (
      <ProtectedRoute requiredRoles={["OWNER"]}>
        <OwnerEvents />
      </ProtectedRoute>
    ),
  },
  {
    path: "/manage/reviews",
    element: (
      <ProtectedRoute requiredRoles={["OWNER"]}>
        <OwnerReviews />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRoles={["ADMIN"]}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <ProtectedRoute requiredRoles={["ADMIN"]}>
        <AdminUsers />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRoles={["ADMIN"]}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <ProtectedRoute requiredRoles={["ADMIN"]}>
        <AdminUsers />
      </ProtectedRoute>
    ),
  },
  {
    path: "/manage/user",
    element: <UserManagement />,
  },
  {
    path: "/manage/report",
    element: <ReportManagement />,
  },
  {
    path: "/manage/user",
    element: <UserManagement />,
  },
  {
    path: "/manage/report",
    element: <ReportManagement />,
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
];
