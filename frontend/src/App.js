import './App.css';
import Navbar from "./components/navbar/Navbar"
import Footer from './components/footer/Footer';
import Homepage from './components/landing page/Homepage';
import React from 'react';
import SingleProduct from './components/singleProduct page/singleProductpage';
import Cart from './components/cart/cart'
import ProductPage from './components/product page/ProductListing';
import ClerkSignup from './components/login-signup/ClerkSignup'
import ClerkLogin from './components/login-signup/ClerkLogin'
import Checkout1 from './components/payment-checkout/checkOut1';
import Checkout from './components/payment-checkout/Checkout';
import { Routes, Route } from "react-router-dom"
import ThankYOu from './components/payment-checkout/thankYou';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import CopilotWidget from './components/CopilotWidget';

import AboutUs from './components/about/AboutUs';

import Offers from './components/offers/Offers';
import Orders from './components/orders/Orders';
import OrderDetail from './components/orders/OrderDetail';

const ProtectedRoute = ({ children }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

function App() {
  return (
    <div>
      <Navbar />
      <Routes >
        <Route path='/' element={<Homepage />} />
        <Route path='/about' element={<AboutUs />} />
        <Route path='/login' element={<ClerkLogin />} />
        <Route path='/signup' element={<ClerkSignup />} />
        <Route path='/products' element={<ProductPage />} />
        <Route path="/products/:category/:id" element={<SingleProduct />} />
        <Route path="/cart" element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } />
        <Route path='/checkout' element={
          <ProtectedRoute>
            <Checkout1 />
          </ProtectedRoute>
        } />
        <Route path="/checkout2" element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } />
        <Route path="/thankyou" element={
          <ProtectedRoute>
            <ThankYOu />
          </ProtectedRoute>
        } />
        <Route path='/orders' element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        } />
        <Route path='/orders/:id' element={
          <ProtectedRoute>
            <OrderDetail />
          </ProtectedRoute>
        } />
        <Route path='/offers' element={<Offers />} />
      </Routes>
      <CopilotWidget />
      <Footer />
    </div>
  );
}

export default App;
