import React from "react";
import "./ProListing.css"
import { useNavigate } from "react-router-dom";

function ProductComponent({ sort, products, category, price, isPreFiltered = false }) {
  const navigate = useNavigate()

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

  if (!products || !Array.isArray(products)) {
    return <div className="container"><p>Loading products...</p></div>;
  }

  if (sort !== "") {
    products.sort((a, b) => {
      const priceA = parseFloat(a.price) || 0;
      const priceB = parseFloat(b.price) || 0;
      if (sort === "lth") return priceA - priceB;
      else if (sort === 'htl') return priceB - priceA;
      return 0;
    })
  }

  return (
    <div className="container">
      {
        (() => {
          const filteredProducts = products
            .filter((elem) => {
              // Skip category filtering if products are already filtered by API
              if (isPreFiltered) return true;
              if (!category) return true;
              return elem.category && elem.category.toLowerCase().includes(category.toLowerCase());
            })
            .filter((el) => {
              const productPrice = parseFloat(el.price) || 0;
              const priceNum = parseInt(price);
              if (priceNum === 0) return true;
              if (priceNum === 50) return productPrice <= 50;
              if (priceNum === 100) return productPrice > 50 && productPrice <= 100;
              if (priceNum === 150) return productPrice > 100 && productPrice <= 150;
              if (priceNum === 200) return productPrice > 150;
              return true;
            });

          if (filteredProducts.length === 0) {
            return <div style={{ textAlign: 'center', padding: '50px' }}><h3>No products found</h3></div>;
          }

          return filteredProducts.map((elem) => {
            const categorySlug = getCategorySlug(elem.category);
            const productPrice = parseFloat(elem.price) || 0;
            const originalPrice = (productPrice * 1.1).toFixed(2);
            return (
              <div key={elem.id} onClick={() => { navigate(`/products/${categorySlug}/${elem.id}`) }} className="singleContainer">
                <div style={{ marginBottom: "35px" }}>
                  <img width="100%" src={elem.image_url || "/images/placeholder.jpg"} alt={elem.category} />
                </div>
                <div>
                  <h4 style={{ fontWeight: "bold" }}>{elem.name}</h4>
                  <p style={{ color: "rgb(93, 93, 93)", fontSize: "13px", height: "25px" }}>{elem.description?.substring(0, 50) || elem.category}</p>
                  <p style={{ textDecoration: "line-through" }}><span style={{ fontSize: "14px" }} >$</span>{originalPrice}</p>
                  <h4 style={{ fontWeight: "bolder", marginTop: "-10px" }}><span style={{ fontSize: "14px" }} >$</span>{productPrice.toFixed(2)}</h4>
                  <p style={{ bottom: "10px", fontSize: "14px", color: "rgb(93, 93, 93)" }}>Price valid Dec 15 - Jan 15</p>
                </div>
              </div>
            )
          });
        })()
      }
    </div>
  )

}

export default ProductComponent;

