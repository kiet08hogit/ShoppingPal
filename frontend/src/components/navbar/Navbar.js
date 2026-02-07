import React from "react";
import "../navbar/header.css";

import { useEffect, useState } from 'react'
import { productsAPI, cartAPI } from '../../utils/api';

import { useNavigate } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useRef } from "react";

export default function Navbar() {
  let inputRef = useRef()
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate()
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = async () => {
    if (!isSignedIn) {
      setCartCount(0);
      return;
    }
    try {
      const response = await cartAPI.getCart();
      const items = response.data.items || [];
      const count = items.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(count);
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  useEffect(() => {
    updateCartCount();

    const handleCartUpdate = () => {
      updateCartCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [isSignedIn]);

  // Helper function to get category slug from product
  const getCategorySlug = (categoryName) => {
    if (!categoryName) return '';
    const lowerCat = categoryName.toLowerCase();
    if (lowerCat.includes('hard hat')) return 'hard_hat';
    if (lowerCat.includes('power tool')) return 'power_tools';
    if (lowerCat.includes('safety glass')) return 'safety_glasses';
    if (lowerCat.includes('safety glove')) return 'safety_gloves';
    return '';
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await productsAPI.searchProducts(query);
      setSearchResults(response.data.slice(0, 5)); // Show top 5 results
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };


  return (
    <div>
      <header id="main-header">
        <div className="left-header">
          <button
            className="btn"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasWithBothOptions"
            aria-controls="offcanvasWithBothOptions"
          >
            {" "}
            <span className="material-symbols-outlined">density_medium</span>
          </button>

          <div
            className="offcanvas offcanvas-start"
            data-bs-scroll="true"
            tabIndex="-1"
            id="offcanvasWithBothOptions"
            aria-labelledby="offcanvasWithBothOptionsLabel"
          >
            <div id="canvasHeader" className="offcanvas-header">
              <h5
                className="offcanvas-title"
                id="offcanvasWithBothOptionsLabel"
                style={{ display: "flex", margin: "auto" }}
              >
                <img
                  style={{ cursor: "pointer", maxWidth: "280px" }}
                  onClick={() => { navigate("/") }}
                  src="/images/industra-logo1.png"
                  alt="INDUSTRA Logo"
                />
              </h5>

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div
              className="offcanvas-body"
              id="bodyHover"
              style={{
                display: "flex",
                flexDirection: "column",

                marginTop: "10px",

                paddingLeft: "50px"
              }}
            >
              <h2 style={{ cursor: "pointer" }} onClick={() => {
                navigate('/products');
                // Optional: Close the offcanvas menu after clicking
                const closeBtn = document.querySelector('.btn-close');
                if (closeBtn) closeBtn.click();
              }}>Products</h2>
              <h2 style={{ cursor: "pointer" }} onClick={() => {
                navigate('/about');
                const closeBtn = document.querySelector('.btn-close');
                if (closeBtn) closeBtn.click();
              }}>About Us</h2>
              <h2 style={{ cursor: "pointer" }} onClick={() => {
                navigate('/offers');
                const closeBtn = document.querySelector('.btn-close');
                if (closeBtn) closeBtn.click();
              }}>Offers</h2>
              <br />
              <br />

              <h6 onClick={() => navigate('/orders')} style={{ cursor: "pointer" }}>Track your order</h6>
              <br />
              <br />
              <p onClick={() => navigate('/stores')} style={{ cursor: "pointer" }}>Our stores</p>
              <p onClick={() => navigate('/service')} style={{ cursor: "pointer" }}>Customer service</p>
            </div>
          </div>
          <p>Menu</p>
        </div>

        <div className="image_logo">

          <img
            onClick={() => { navigate("/") }}
            src="/images/industra-logo1.png"
            alt="INDUSTRA Logo"
            style={{ cursor: "pointer", maxHeight: "250px" }}
          />
        </div>
        <div className="header__search">
          <div className="header2">

            <input
              ref={inputRef}
              type="text"
              className="header__searchInput"
              placeholder="What are you looking for?"
              onChange={(e) => handleSearch(e.target.value)}
            />

            <span id="header__searchIcon" className="material-symbols-outlined">search</span>

            <div className="final-Data">
              {
                searchQuery === "" ? <div></div> :
                  isSearching ? <li className="details">Searching...</li> :
                    searchResults.length === 0 ? <li className="details">No results found</li> :
                      searchResults.map((item) => {
                        const categorySlug = getCategorySlug(item.category);
                        return (
                          <li
                            key={item.id}
                            className="details"
                            onClick={() => {
                              navigate(`/products/${categorySlug}/${item.id}`)
                              inputRef.current.value = ""
                              setSearchQuery("")
                              setSearchResults([])
                            }}
                          >
                            {item.name}
                          </li>
                        );
                      })
              }
            </div>
          </div>
        </div>


        <div className="right-header">
          <button

            className="btn"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasRight"
            aria-controls="offcanvasRight"
          >
            {" "}
            <li className="login-icon">
              <span className="material-symbols-outlined"> person</span> <span style={{ fontWeight: "bolder" }} className="hej">{isSignedIn ? user.firstName?.toUpperCase() : "Log in or sign up"}</span>
            </li>
          </button>

          <div
            className="offcanvas offcanvas-end"
            tabIndex="-1"
            id="offcanvasRight"
            aria-labelledby="offcanvasRightLabel"
          >
            <div className="offcanvas-header" >
              <h5 className="offcanvas-title" id="offcanvasRightLabel">Menu</h5>
              <br />

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body">
              <div id="loggin">
                <h2>{isSignedIn ? user.firstName?.toUpperCase() : "Welcome"}</h2>
                <button data-bs-dismiss="offcanvas" onClick={() => {
                  if (!isSignedIn) {
                    navigate("/login")
                  } else {
                    signOut(() => navigate("/"))
                  }
                }}>{!isSignedIn ? "Login" : "Logout"}</button>
              </div>
              <hr />
              {isSignedIn && (
                <div className="user-menu-items">
                  <div onClick={() => { navigate('/orders'); const closeBtn = document.querySelector('.btn-close'); if (closeBtn) closeBtn.click(); }} className="menu-item">
                    <span className="material-symbols-outlined">inventory_2</span>
                    <span>My Orders</span>
                  </div>
                  <div onClick={() => { navigate('/profile'); const closeBtn = document.querySelector('.btn-close'); if (closeBtn) closeBtn.click(); }} className="menu-item">
                    <span className="material-symbols-outlined">location_on</span>
                    <span>Saved Addresses</span>
                  </div>
                  <div onClick={() => { navigate('/wallet'); const closeBtn = document.querySelector('.btn-close'); if (closeBtn) closeBtn.click(); }} className="menu-item">
                    <span className="material-symbols-outlined">account_balance_wallet</span>
                    <span>Wallet & Payments</span>
                  </div>
                  <div onClick={() => { navigate('/wishlist'); const closeBtn = document.querySelector('.btn-close'); if (closeBtn) closeBtn.click(); }} className="menu-item">
                    <span className="material-symbols-outlined">favorite</span>
                    <span>Wishlist</span>
                  </div>
                </div>
              )}
              <hr />
              <div id="induststraFamily">
                <h4>Join INDUSTRA Rewards</h4>
                <span className="material-symbols-outlined">chevron_right</span>
              </div>
              <hr />
            </div>
          </div>
          <li className="cart-icon" style={{ position: "relative" }}>
            <span className="material-symbols-outlined">local_shipping</span>
          </li>
          <li onClick={() => {
            navigate("/cart")
          }} className="cart-icon" style={{ position: "relative" }}>
            <span className="material-symbols-outlined">shopping_basket</span>
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </li>
        </div>
      </header>

      <br />
      <div id="category">
        <li onClick={() => {

          navigate('/products')
        }}>Products</li>
        <li onClick={() => { navigate('/about') }}>About Us</li>
        <li onClick={() => { navigate('/offers') }}>Offers</li>
      </div>
    </div>
  );
}
