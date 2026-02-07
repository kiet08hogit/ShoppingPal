import React, { useState, useEffect } from 'react'
import "../landing page/homepage.css"
import {useNavigate} from "react-router-dom"
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
                <a onClick={()=>{navigate("/products")}}><img src="/images/grainger_4-1200x800.jpg" alt=""/></a>
                <a href=""><img src="/images/grainger_04.jpg" alt=""/></a>
                <a href=""><img src="/images/grainger_5-1200x800.jpg" alt="" /></a>
                <a href=""><img src="/images/W-DTMW172_MFG-MW_OSG_712x396.jpg" alt="" /></a>
            </div>
        </div>
        <div class="scroll-menu">
            <div class="scroll-menu-item">
                
                <a href=""><i class="fa-sharp fa-solid fa-right"></i><img class="scroll-menu-img" src="/images/promo-assembly.jpg" alt=""/></a>
                <p id="first-scroll-item-p">Lift, Push, Pull & Stand</p>
            </div>

            <div class="scroll-menu-item" id="second-scroll-item">
                <a href=""><img class="scroll-menu-img" src="/images/promo-price.jpg" alt=""/></a>
                <p>Supercharge your shopping</p>
              
            </div>

            <div class="scroll-menu-item" id="third-scroll-item">
                <a href=""><img class="scroll-menu-img" src="/images/promo-budget.jpg" alt=""/></a>
                <p>New lower price</p>
                
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
                    <div key={category.id} class="category-card" onClick={() => navigate("/products")}>
                        <img src={category.image} alt={category.name} />
                        <h3>{category.name}</h3>
                    </div>
                ))}
            </div>
        </div>

        <hr/>
    </div>
    </div>    
  )
}
