import React from "react";
import "../navbar/header.css";

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useRef } from "react";export default function Navbar() {
  let inputRef = useRef()
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate()
  const [filteredData, setFilteredData] = useState([]);
  const [word, searchWord] = useState("")

  const [data,setData] =useState([])

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    axios.get(`${apiUrl}/products`)
      .then((res) => {
        console.log(res)
        setFilteredData(res.data)
      })

  }, [])


  const handleFilter = (event) => {
    searchWord(event.target.value)
    console.log(word)

  }
  let filteredItems = filteredData.filter((item) => item.typeName && item.typeName
    .includes(word));


  console.log(filteredItems);

  let slicedArr = filteredItems.slice(2,7 );


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
                style={{cursor:"pointer", maxWidth: "280px"}}
                  onClick={()=>{navigate("/")}}
                  src="/images/industra-logo.png"
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
              <h2>Products</h2>
              <h2>Rooms</h2>
              <h2>New at INDUSTRA</h2>
              <h2>Offers</h2>
              <br />
              <br />

              <h6>Tips and inspirations</h6>
              <h6>Currently at INDUSTRA</h6>
              <h6>Track your order</h6>
              <br />
              <br />
              <p>Join INDUSTRA Rewards</p>
              <p>INDUSTRA Restaurant</p>
              <p>Our stores</p>
              <p>Design your room</p>
              <p>Customer service</p>
              <p>Download the INDUSTRA app</p>
            </div>
          </div>
          <p>Menu</p>
        </div>

        <div className="image_logo">

          <img
            onClick={()=>{navigate("/")}}
            src="/images/industra-logo.png"
            alt="INDUSTRA Logo"
            style={{cursor: "pointer", maxHeight: "250px"}}
          />
        </div>
        <div className="header__search">
          <div className="header2">

            <input
              ref={inputRef}
              type="text" className="header__searchInput"
              placeholder="What are you looking for?"
              onChange={handleFilter} />

            <span id="header__searchIcon" className="material-symbols-outlined">search</span>

            <div className="final-Data">
              {

                word === "" ? <div></div> :
                  slicedArr.map((items) => (


                    <li className="details" onClick={() => {
                      navigate(`/products/${items.id}`)
                      inputRef.current.value = ""
                      searchWord("")
                    }}>{items.mainImageAlt}</li>

                  ))
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
              <span className="material-symbols-outlined"> person</span> <span style={{fontWeight:"bolder"}} className="hej">{isSignedIn ? user.firstName?.toUpperCase() : "Log in or sign up"}</span>
            </li>
          </button>

          <div
            className="offcanvas offcanvas-end"
            tabIndex="-1"
            id="offcanvasRight"
            aria-labelledby="offcanvasRightLabel"
          >
            <div className="offcanvas-header" >
              <h5 className="offcanvas-title" id="offcanvasRightLabel"></h5>
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
              <div id="induststraFamily">
                <h4>Join INDUSTRA Rewards</h4>
                <span className="material-symbols-outlined">chevron_right</span>
              </div>
              <hr />
            </div>
          </div>
          <li className="cart-icon">
            {" "}
            <span className="material-symbols-outlined">local_shipping</span>
          </li>
          <li onClick={() => {
            navigate("/cart")
          }} className="cart-icon">
            <span className="material-symbols-outlined">shopping_basket</span>
          </li>
        </div>
      </header>

      <br />
      <div id="category">
        <li onClick={() => {

          navigate('/products')
        }}>Products</li>
        <li>Rooms</li>
        <li>New at INDUSTRA</li>
        <li>Offers</li>
      </div>
    </div>
  );
}
