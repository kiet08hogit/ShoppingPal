import "./checkOut1.css"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { cartAPI } from "../../utils/api";

function Checkout1() {
    let navigate = useNavigate()
    const { isSignedIn } = useUser();
    const [cartItems, setCartItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (isSignedIn) {
            loadCart();
        } else {
            navigate('/login');
        }
    }, [isSignedIn])

    async function loadCart() {
        try {
            const response = await cartAPI.getCart();
            setCartItems(response.data.items || []);
        } catch (error) {
            console.error('Error loading cart:', error);
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    }
    
    let subtotal = 0;
    cartItems.forEach(item => {
        subtotal += (parseFloat(item.price) || 0) * item.quantity;
    });

    // Calculate shipping and tax
    const shippingCost = 7.00;
    const taxRate = 0.10; // 10% tax for IL
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + shippingCost + taxAmount;

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
    }

    return (
        <div className="modern-checkout-container">
            <div className="checkout-header">
                <h1>Checkout</h1>
                <div className="checkout-steps">
                    <div className="step active">1. Shipping</div>
                    <div className="step" style={{opacity: 0.5, cursor: 'not-allowed'}}>2. Payment</div>
                    <div className="step" style={{opacity: 0.5, cursor: 'not-allowed'}}>3. Confirmation</div>
                </div>
            </div>
            
            <div className="checkout-content">
                <div className="shipping-section">
                    <div className="section-card">
                        <h2>Delivery Address</h2>
                        <form>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>First<br/>Name</label>
                                    <input type="text" className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label>Last<br/>Name</label>
                                    <input type="text" className="form-input" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Full Name for Delivery Address</label>
                                <input type="text" className="form-input" />
                            </div>

                            <div className="form-group">
                                <label>Address Line 1</label>
                                <input type="text" className="form-input" />
                            </div>

                            <div className="form-group">
                                <label>Address Line 2 (optional)</label>
                                <input type="text" className="form-input" />
                            </div>

                            <div className="form-row-triple">
                                <div className="form-group">
                                    <label>City</label>
                                    <input type="text" className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label>State</label>
                                    <input 
                                        type="text" 
                                        className="form-input" 
                                        value="Illinois (IL)" 
                                        disabled 
                                        style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Zip</label>
                                    <input type="text" className="form-input" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Phone(optional)</label>
                                <input type="tel" className="form-input" />
                            </div>

                            <button 
                                type="button"
                                className="continue-btn" 
                                onClick={() => navigate("/checkout2")}
                            >
                                Continue to Payment
                            </button>
                        </form>
                    </div>
                </div>

                <div className="cart-summary-section">
                    <div className="summary-card">
                        <h2>Order Summary</h2>
                        <div className="summary-count">Total Items: {cartItems.length}</div>
                        
                        <div className="cart-items-list">
                            {cartItems.map((item) => (
                                <div key={item.id} className="checkout-cart-item">
                                    <img 
                                        src={item.image_url} 
                                        alt={item.name}
                                        className="item-image"
                                    />
                                    <div className="item-details">
                                        <h4>{item.name}</h4>
                                        <p className="item-qty">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="item-price">
                                        ${((parseFloat(item.price) || 0) * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="summary-totals">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Estimated Shipping</span>
                                <span>${shippingCost.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Estimated Tax (10% IL)</span>
                                <span>${taxAmount.toFixed(2)}</span>
                            </div>
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>${totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
     )
}

            export default Checkout1;