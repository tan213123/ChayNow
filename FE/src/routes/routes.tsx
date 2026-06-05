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
import OwnerEvents from "@/pages/OwnerEvents";
import OwnerReviews from "@/pages/OwnerReviews";

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
    element: <Favorites />,
  },
  {
    path: "/restaurant/:id",
    element: <RestaurantDetail />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/manage",
    element: <OwnerDashboard />,
  },
  {
    path: "/manage/edit",
    element: <OwnerEdit />,
  },
  {
    path: "/manage/new-dish",
    element: <OwnerNewDish />,
  },
  {
    path: "/manage/events",
    element: <OwnerEvents />,
  },
  {
    path: "/manage/reviews",
    element: <OwnerReviews />,
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
