import type { RouteObject } from "react-router-dom";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Login from "@/pages/Login";

export const routes: RouteObject[] = [
  {
    path: "/login",
    element: <Login />,
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
