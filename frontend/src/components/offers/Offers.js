import React from 'react';
import './Offers.css';
import { useNavigate } from 'react-router-dom';

const Offers = () => {
    const navigate = useNavigate();

    const offers = [
        {
            id: 1,
            title: "Bulk Safety Gear",
            description: "Equip your entire team. Buy 10+ safety vests and get 15% off.",
            code: "SAFETEAM15",
            image: "/images/safety-vest-offer.jpg", // Placeholder or use font awesome icon if logic preferred
            color: "#e6f0ff",
            icon: "engineering"
        },
        {
            id: 2,
            title: "Power Tool Clearance",
            description: "End of season sale on heavy-duty drills and saws. While supplies last.",
            code: "POWER20",
            image: "/images/power-tool-offer.jpg",
            color: "#fff0e6",
            icon: "construction"
        },
        {
            id: 3,
            title: "New Account Special",
            description: "Register a business account and get free shipping on your first freight order.",
            code: "FREESHIP",
            image: "/images/shipping-offer.jpg",
            color: "#e6fffa",
            icon: "local_shipping"
        },
        {
            id: 4,
            title: "Seasonal Maintenance",
            description: "25% off all lubricants and cleaning supplies for facility maintenance.",
            code: "CLEAN25",
            image: "/images/maintenance-offer.jpg",
            color: "#f0f0f0",
            icon: "cleaning_services"
        }
    ];

    return (
        <div className="offers-container">
            <div className="offers-header">
                <h1>Exclusive Industrial Offers</h1>
                <p>Maximize your operational budget with our current promotions.</p>
            </div>

            <div className="offers-grid">
                {offers.map((offer) => (
                    <div key={offer.id} className="offer-card" style={{ borderTop: `4px solid ${offer.color === '#f0f0f0' ? '#666' : '#0058a3'}` }}>
                        <div className="offer-icon-wrapper">
                            <span className="material-symbols-outlined offer-icon">{offer.icon}</span>
                        </div>
                        <div className="offer-content">
                            <h3>{offer.title}</h3>
                            <p>{offer.description}</p>
                            <div className="offer-code-box">
                                <span>Use Code:</span>
                                <span className="code">{offer.code}</span>
                            </div>
                            <button className="shop-offer-btn" onClick={() => navigate('/products')}>
                                Shop Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="newsletter-section">
                <h2>Stay Updated</h2>
                <p>Subscribe to receive the latest industrial supply deals directly to your inbox.</p>
                <div className="input-group">
                    <input type="email" placeholder="Enter your work email" />
                    <button>Subscribe</button>
                </div>
            </div>
        </div>
    );
};

export default Offers;
