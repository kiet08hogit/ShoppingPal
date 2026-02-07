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
        let response;
        // If we have a category selected (either from URL or dropdown), fetch all products and filter client-side, 
        // OR fetch by category. 
        // To keep it simple and consistent with your ProductComponent filtering logic, 
        // let's fetch ALL products if no category is in URL, or fetch by category if URL has it.
        // But since you want the dropdown to work, fetching ALL products is often better 
        // so you can filter them in the UI without re-fetching.

        // HOWEVER, your existing logic was: if URL has category, fetch by category. 
        // If I reload, urlCategory exists, so it fetches only those.
        // User then changes dropdown to "All", but we only have "Hard hats" in state.

        // BETTER APPROACH: Always fetch all products so client-side filtering works seamlessly
        // OR handle the "fetch on change" logic.

        // Let's stick to cleaning up the interference:
        response = await productsAPI.getAllProducts();

        dispatch(setProducts(response.data));
      } catch (err) {
        console.log("Error fetching products:", err);
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
