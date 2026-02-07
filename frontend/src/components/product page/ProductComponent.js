import React from "react";
import "./ProListing.css"
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { cartAPI } from "../../utils/api";

function ProductComponent({ sort, products, category, price, isPreFiltered = false }) {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  const getCategorySlug = (categoryName) => {
    if (!categoryName) return '';
    const lowerCat = categoryName.toLowerCase();

    // If already in slug format, return as-is
    if (lowerCat === 'hard_hat' || lowerCat === 'power_tools' ||
      lowerCat === 'safety_glasses' || lowerCat === 'safety_gloves') {
      return lowerCat;
    }

    // Otherwise, convert from display name to slug
    if (lowerCat.includes('hard hat')) return 'hard_hat';
    if (lowerCat.includes('power tool')) return 'power_tools';
    if (lowerCat.includes('safety glass')) return 'safety_glasses';
    if (lowerCat.includes('safety glove')) return 'safety_gloves';
    return '';
  };

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();

    if (!isSignedIn) {
      navigate("/login");
      return;
    }

    try {
      const categorySlug = getCategorySlug(product.category);

      window.dispatchEvent(new CustomEvent('cartCountIncrement', { detail: { quantity: 1 } }));

      await cartAPI.addToCart(product.id, categorySlug, 1);

      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error("Error adding to cart:", error);
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const handleBuyNow = async (e, product) => {
    e.stopPropagation();

    if (!isSignedIn) {
      navigate("/login");
      return;
    }

    try {
      const categorySlug = getCategorySlug(product.category);

      // Optimistic update - increment cart count immediately
      window.dispatchEvent(new CustomEvent('cartCountIncrement', { detail: { quantity: 1 } }));

      await cartAPI.addToCart(product.id, categorySlug, 1);
      window.dispatchEvent(new Event('cartUpdated'));
      navigate("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      // Revert optimistic update on error
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };


  if (!products || !Array.isArray(products)) {
    console.log("⏳ Products not ready yet");
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
    <div className="product-grid">
      {
        (() => {
          const filteredProducts = products
            .filter((elem) => {
              if (isPreFiltered) return true;
              if (!category) return true;

              const normalize = (str) => str ? str.toLowerCase().replace(/[\s_]/g, '') : '';
              const productCat = normalize(elem.category);
              const filterCat = normalize(category);

              return productCat.includes(filterCat);
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
              <div key={`${elem.category}_${elem.id}`} onClick={() => { navigate(`/products/${categorySlug}/${elem.id}`) }} className="singleContainer">
                <div className="product-image-container">
                  <img width="100%" src={elem.image_url || "/images/placeholder.jpg"} alt={elem.category} />
                </div>
                <div className="product-details">
                  <h4 className="product-title">{elem.name}</h4>
                  <p className="product-description">{elem.description || elem.category}</p>
                  <p style={{ textDecoration: "line-through" }}><span style={{ fontSize: "14px" }} >$</span>{originalPrice}</p>
                  <h4 style={{ fontWeight: "bolder", marginTop: "-10px" }}><span style={{ fontSize: "14px" }} >$</span>{productPrice.toFixed(2)}</h4>
                  <p style={{ bottom: "10px", fontSize: "14px", color: "rgb(93, 93, 93)" }}>Price valid Dec 15 - Jan 15</p>
                  <div className="button-group">
                    <button
                      className="add-to-cart-btn"
                      onClick={(e) => handleAddToCart(e, elem)}
                    >
                      Add to Cart
                    </button>
                    <button
                      className="buy-now-btn"
                      onClick={(e) => handleBuyNow(e, elem)}
                    >
                      Buy Now
                    </button>
                  </div>
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

