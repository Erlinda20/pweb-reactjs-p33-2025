import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookPage from './pages/book/BookPage';
import BookDetail from './pages/book/BookDetail';
import AddBookPage from './pages/book/AddBookPage';
import TransactionPage from './pages/transaction/TransactionPage';
import TransactionDetail from './pages/transaction/TransactionDetail';
import CheckoutPage from './pages/transaction/CheckoutPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<ProtectedRoute><BookPage /></ProtectedRoute>} />
            <Route path="/books/:id" element={<ProtectedRoute><BookDetail /></ProtectedRoute>} />
            <Route path="/books/add" element={<ProtectedRoute><AddBookPage /></ProtectedRoute>} />
            <Route path="/transactions" element={<ProtectedRoute><TransactionPage /></ProtectedRoute>} />
            <Route path="/transactions/:id" element={<ProtectedRoute><TransactionDetail /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </ChakraProvider>
  );
}

export default App;

import AppRouter from "./routes/router";

function App() {
  return <AppRouter />;
}

export default App;
