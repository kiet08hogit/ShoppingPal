import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "./productsActions";
import ProductComponent from "./ProductComponent";
import "./ProListing.css"

const ProductPage = () => {
  let [sort,setSort] = useState("")
  let [category,setCategory] = useState("")
  let [price,setPrice] = useState(0)
  const products = useSelector((state) => state.product.products);
  let n = products
  const dispatch = useDispatch();
  const fetchProducts = () => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    axios.get(`${apiUrl}/products`)
      .then((res) =>{
        dispatch(setProducts(res.data));
      } )
      .catch((err) => {
        console.log("Err: ", err);
      });
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <><div id="filter-bar">
      <select onChange={(e)=>{setSort(e.target.value)}} name="price" id="price">
        <option value="">Sort</option>
        <option value="#" disabled></option>
        <option value="htl">Price: High to Low</option>
        <option value="#" disabled></option>
        <option value="lth">Price: Low to High</option>
      </select>
      <select onChange={(e)=>{setCategory(e.target.value)}} name="beds" id="beds">
        <option value="">Category</option>
        <option value="#" disabled></option>
        <option value="Hard Hat">Hard Hat</option>
        <option value="#" disabled></option>
        <option value="Power Tools">Power Tools</option>
        <option value="#" disabled></option>
        <option value="Safety Glasses">Safety Glasses</option>
        <option value="#" disabled></option>
        <option value="Safety Gloves">Safety Gloves</option>
        <option value="#" disabled></option>
      </select>
      <select onChange={(e)=>{setPrice(e.target.value)}} name="price-range" id="price-range">
        <option value="0">Price</option>
        <option value="#" disabled></option>
        <option value="4999">$0-$4999</option>
        <option value="#" disabled></option>
        <option value="9999">$5,000-$9999</option>
        <option value="#" disabled></option>
        <option value="14999">$10,000-$14999</option>
        <option value="#" disabled></option>
        <option value="15000">Above $15,000</option>
      </select>
      </div><div className="ui grid container">
          <ProductComponent sort = {sort} products = {products}
          category = {category}
          price = {price} />
      </div></>
  );
};

export default ProductPage;
