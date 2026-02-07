import React, { useState, useEffect } from 'react'
import "../landing page/homepage.css"
import { useNavigate } from "react-router-dom"
import categoriesData from "../../data/categories.json"

export default function Homepage() {
    let navigate = useNavigate()
    const [categories, setCategories] = useState([])

    useEffect(() => {
        setCategories(categoriesData.categories)
    }, [])
    return (
        <div>
            <div class="page-content">
                <div class="img-gallery-1">
                    <h1>Reclaim your productivity</h1>
                    <div class="gallrey-items gallery-2x2">
                        <button onClick={() => { navigate("/products") }} style={{ background: "none", border: "none", padding: 0 }}><img src="/images/grainger_4-1200x800.jpg" alt="Navigate to products" /></button>
                        <button style={{ background: "none", border: "none", padding: 0 }}><img src="/images/grainger_04.jpg" alt="Gallery item" /></button>
                        <button style={{ background: "none", border: "none", padding: 0 }}><img src="/images/grainger_5-1200x800.jpg" alt="Gallery item" /></button>
                        <button style={{ background: "none", border: "none", padding: 0 }}><img src="/images/W-DTMW172_MFG-MW_OSG_712x396.jpg" alt="Gallery item" /></button>
                    </div>
                </div>
                <div class="scroll-menu">
                    <div class="scroll-menu-item">
                        <button style={{ background: "none", border: "none", padding: 0 }}>
                            <i className="fa-solid fa-dolly scroll-menu-icon"></i>
                        </button>
                        <p id="first-scroll-item-p">Lift, Push, Pull</p>
                    </div>

                    <div class="scroll-menu-item" id="second-scroll-item">
                        <button style={{ background: "none", border: "none", padding: 0 }}>
                            <i className="fa-solid fa-bolt scroll-menu-icon"></i>
                        </button>
                        <p>Supercharge work</p>
                    </div>

                    <div class="scroll-menu-item" id="third-scroll-item">
                        <button style={{ background: "none", border: "none", padding: 0 }}>
                            <i className="fa-solid fa-tag scroll-menu-icon"></i>
                        </button>
                        <p>New lower prices</p>
                    </div>
                </div>
                <div class="img-gallery-2">
                    <h1>About us</h1>
                    <p>INDUSTRA has been America's reliable partner for MRO and industrial supplies for more than nine decades. We are dedicated to connecting customers with the essential products and services they require. With access to over a million items from a vast network of trusted suppliers, INDUSTRA provides seamless online tools and a mobile app for ordering and managing MRO equipment anytime, anywhere. Our commitment is further supported by round-the-clock customer service and expert technical assistance from professionals with deep expertise in MRO tools and products.</p>
                </div>

                <div class="categories-section">
                    <h2>Our Categories</h2>
                    <div class="categories-grid">
                        {categories.map((category) => (
                            <div key={category.slug} class="category-card" onClick={() => navigate(`/products?category=${category.slug}`)}>
                                <img src={category.image} alt={category.name} />
                                <h3>{category.name}</h3>
                            </div>
                        ))}
                    </div>
                </div>

                <hr />
            </div>
        </div>
    )
}
