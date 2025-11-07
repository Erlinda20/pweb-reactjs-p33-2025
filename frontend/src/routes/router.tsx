import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import BooksList from "../pages/BooksList";
import BookDetail from "../pages/BookDetail";
import AddBook from "../pages/AddBook";
import ManageBooks from "../pages/ManageBooks";
import Transactions from "../pages/Transactions";
import TransactionDetail from "../pages/TransactionDetail";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "../components/Navbar";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />, // route default
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    element: <Navbar />,
    children: [
      {
        path: "/books",
        element: (
          <ProtectedRoute>
            <BooksList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/books/manage",
        element: (
          <ProtectedRoute>
            <ManageBooks />
          </ProtectedRoute>
        ),
      },
      {
        path: "/books/add",
        element: (
          <ProtectedRoute>
            <AddBook />
          </ProtectedRoute>
        ),
      },
      {
        path: "/books/edit/:id",
        element: (
          <ProtectedRoute>
            <AddBook />
          </ProtectedRoute>
        ),
      },
      {
        path: "/books/:id",
        element: (
          <ProtectedRoute>
            <BookDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "/transactions",
        element: (
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        ),
      },
      {
        path: "/transactions/:id",
        element: (
          <ProtectedRoute>
            <TransactionDetail />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
