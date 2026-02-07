import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { setProducts } from "./productsActions";
import { productsAPI } from "../../utils/api";
import ProductComponent from "./ProductComponent";
import "./ProListing.css"

const ProductPage = () => {
  let [sort,setSort] = useState("")
  let [category,setCategory] = useState("")
  let [price,setPrice] = useState(0)
  const [searchParams] = useSearchParams();
  const urlCategory = searchParams.get('category');
  
  const products = useSelector((state) => state.product.products);
  const dispatch = useDispatch();
  
  const fetchProducts = async () => {
    try {
      let response;
      if (urlCategory) {
        response = await productsAPI.getProductsByCategory(urlCategory);
      } else {
        response = await productsAPI.getAllProducts();
      }
      dispatch(setProducts(response.data));
    } catch (err) {
      console.log("Error fetching products:", err);
      dispatch(setProducts([]));
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, [urlCategory]);

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
        <option value="">All Categories</option>
        <option value="#" disabled></option>
        <option value="Hard hat">Hard Hats</option>
        <option value="#" disabled></option>
        <option value="Power Tools">Power Tools</option>
        <option value="#" disabled></option>
        <option value="Safety Glasses">Safety Glasses</option>
        <option value="#" disabled></option>
        <option value="Safety Gloves">Safety Gloves</option>
        <option value="#" disabled></option>
      </select>
      <select onChange={(e)=>{setPrice(e.target.value)}} name="price-range" id="price-range">
        <option value="0">All Prices</option>
        <option value="#" disabled></option>
        <option value="50">$0-$50</option>
        <option value="#" disabled></option>
        <option value="100">$50-$100</option>
        <option value="#" disabled></option>
        <option value="150">$100-$150</option>
        <option value="#" disabled></option>
        <option value="200">Above $150</option>
      </select>
      </div><div className="ui grid container">
          <ProductComponent 
            sort={sort} 
            products={products}
            category={category}
            price={price}
            isPreFiltered={!!urlCategory}
          />
      </div></>
  );
};

export default ProductPage;
