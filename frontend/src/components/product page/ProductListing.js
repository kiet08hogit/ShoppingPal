import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { setProducts } from "./productsActions";
import { productsAPI } from "../../utils/api";
import ProductComponent from "./ProductComponent";
import "./ProListing.css"

const ProductPage = () => {
  let [sort, setSort] = useState("")
  let [category, setCategory] = useState("")
  let [price, setPrice] = useState(0)
  const [searchParams] = useSearchParams();
  const urlCategory = searchParams.get('category');

  // Initialize category state from URL if present
  useEffect(() => {
    if (urlCategory) {
      setCategory(urlCategory);
    } else {
      setCategory(""); // Reset if no param
    }
  }, [urlCategory]);

  const products = useSelector((state) => state.product.products);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("🔍 Fetching products from API...");
        let response = await productsAPI.getAllProducts();
        
        console.log("✅ Products received:", response.data?.length || 0, "products");
        console.log("📦 Sample product:", response.data?.[0]);
        
        dispatch(setProducts(response.data));
      } catch (err) {
        console.error("❌ Error fetching products:", err);
        console.error("Error details:", err.response?.data || err.message);
        dispatch(setProducts([]));
      }
    };
    fetchProducts();
  }, [dispatch]);

  return (
    <><div id="filter-bar">
      <select onChange={(e) => { setSort(e.target.value) }} name="sort" id="sort">
        <option value="">Sort</option>
        <option value="#" disabled></option>
        <option value="htl">Price: High to Low</option>
        <option value="#" disabled></option>
        <option value="lth">Price: Low to High</option>
      </select>
      <select value={category} onChange={(e) => { setCategory(e.target.value) }} name="category" id="category">
        <option value="">All Categories</option>
        <option value="#" disabled></option>
        <option value="hard_hat">Hard Hats</option>
        <option value="#" disabled></option>
        <option value="power_tools">Power Tools</option>
        <option value="#" disabled></option>
        <option value="safety_glasses">Safety Glasses</option>
        <option value="#" disabled></option>
        <option value="safety_gloves">Safety Gloves</option>
        <option value="#" disabled></option>
      </select>
      <select onChange={(e) => { setPrice(e.target.value) }} name="price-range" id="price-range">
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
    </div > <div className="ui grid container">
        <ProductComponent
          sort={sort}
          products={products}
          category={category}
          price={price}
          isPreFiltered={false}
        />
      </div></>
  );
};

export default ProductPage;
