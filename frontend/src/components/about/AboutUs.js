import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../landing page/homepage.css"; // Reusing homepage styles for consistency

export default function AboutUs() {
    const navigate = useNavigate();

    return (
        <div className="page-content">
            <div style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}>
                <h1 style={{ textAlign: "center", marginBottom: "40px", fontSize: "3rem", color: "#333" }}>About INDUSTRA</h1>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "center", marginBottom: "60px" }}>
                    <div>
                        <h2 style={{ color: "#AE242A", marginBottom: "20px" }}>Building Industry Since 1934</h2>
                        <p style={{ fontSize: "1.1rem", lineHeight: "1.6", color: "#555", marginBottom: "20px" }}>
                            For over 90 years, INDUSTRA has been the backbone of American manufacturing and maintenance.
                            What started as a small hardware supply shop in Detroit has grown into the nation's
                            premier partner for MRO (Maintenance, Repair, and Operations) supplies.
                        </p>
                        <p style={{ fontSize: "1.1rem", lineHeight: "1.6", color: "#555" }}>
                            We don't just sell tools; we keep factories running, construction sites moving, and
                            businesses thorough. Our commitment to quality and speed is unmatched in the industry.
                        </p>
                    </div>
                    <div style={{ backgroundColor: "#2B323F", padding: "40px", borderRadius: "8px", color: "white" }}>
                        <h3 style={{ borderBottom: "2px solid #F8D348", paddingBottom: "10px", marginBottom: "20px" }}>Our Mission</h3>
                        <p style={{ fontSize: "1.2rem", fontStyle: "italic" }}>
                            "To empower the builders, makers, and fixers of the world with the tools they need,
                            when they need them."
                        </p>
                        <div style={{ marginTop: "30px", display: "flex", gap: "20px" }}>
                            <div style={{ textAlign: "center" }}>
                                <i className="fa-solid fa-truck-fast" style={{ fontSize: "2rem", color: "#F8D348", marginBottom: "10px" }}></i>
                                <p>Fast Delivery</p>
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <i className="fa-solid fa-shield-halved" style={{ fontSize: "2rem", color: "#F8D348", marginBottom: "10px" }}></i>
                                <p>Trusted Quality</p>
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <i className="fa-solid fa-headset" style={{ fontSize: "2rem", color: "#F8D348", marginBottom: "10px" }}></i>
                                <p>24/7 Support</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ backgroundColor: "#f9f9f9", padding: "60px", borderRadius: "12px", textAlign: "center" }}>
                    <h2 style={{ marginBottom: "30px" }}>Why Professionals Choose Us</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "30px" }}>
                        <div>
                            <h3 style={{ color: "#2B323F" }}>1M+ Products</h3>
                            <p>From tiny screws to giant generators, we have it all in stock.</p>
                        </div>
                        <div>
                            <h3 style={{ color: "#2B323F" }}>Expert Advice</h3>
                            <p>Our team consists of industry veterans who know your tools.</p>
                        </div>
                        <div>
                            <h3 style={{ color: "#2B323F" }}>National Network</h3>
                            <p>Warehouses across the country ensure next-day delivery.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/products')}
                        style={{
                            marginTop: "40px",
                            padding: "15px 40px",
                            fontSize: "1.1rem",
                            backgroundColor: "#AE242A",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontWeight: "bold"
                        }}
                    >
                        Explore Our Catalog
                    </button>
                </div>
            </div>
        </div>
    )
}
