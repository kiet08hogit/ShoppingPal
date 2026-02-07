import "./thankyou.css"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { cartAPI, orderAPI } from "../../utils/api"

function ThankYOu() {
    const navigate = useNavigate();
    const location = useLocation();
    const [orderData, setOrderData] = useState(null);
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        // Get order data from navigation state or fetch from cart
        if (location.state) {
            setOrderData(location.state);
        } else {
            // If no state, fetch current cart data
            loadCartData();
        }
    }, [location.state]);

    // Create order when component loads
    useEffect(() => {
        const createOrder = async () => {
            try {
                const response = await orderAPI.createOrder();
                setOrderId(response.data.id);
            } catch (error) {
                console.error('Error creating order:', error);
            }
        };

        // Only create order once when the page loads
        if (!orderId) {
            createOrder();
        }
    }, []);

    async function loadCartData() {
        try {
            const response = await cartAPI.getCart();
            const items = response.data.items || [];
            
            let subtotal = 0;
            items.forEach(item => {
                subtotal += (parseFloat(item.price) || 0) * item.quantity;
            });

            const shippingCost = 7.00;
            const taxRate = 0.10;
            const taxAmount = subtotal * taxRate;
            const totalAmount = subtotal + shippingCost + taxAmount;

            setOrderData({
                cartItems: items,
                subtotal,
                shippingCost,
                taxAmount,
                discountAmount: 0,
                totalAmount,
                couponApplied: false
            });
        } catch (error) {
            console.error('Error loading cart:', error);
        }
    }

    if (!orderData) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
    }

    const { cartItems, subtotal, shippingCost, taxAmount, discountAmount, totalAmount, couponApplied, couponCode, freeShipping } = orderData;
    
    // Calculate discount percentage or check if it's shipping discount
    const isShippingDiscount = couponCode && couponCode.toUpperCase() === 'FREESHIP';
    const discountPercent = !isShippingDiscount && subtotal > 0 && discountAmount > 0 
        ? Math.round((discountAmount / subtotal) * 100) 
        : 0;

    return (
        <div className="modern-checkout-container">
            <div className="checkout-header">
                <h1>Checkout</h1>
                <div className="checkout-steps">
                    <div className="step clickable" onClick={() => navigate('/checkout')}>1. Shipping</div>
                    <div className="step clickable" onClick={() => navigate('/checkout2')}>2. Payment</div>
                    <div className="step active">3. Confirmation</div>
                </div>
            </div>
            
            <div className="confirmation-content">
                <div className="success-card">
                    <img
                        className="success-icon"
                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNMjQgMEMyNy40OTA1IDAgMzAuNTM3IDEuOT
        g0NSAzMi4wNzYgNC44Nzk1QzMyLjgzOCA0LjY4IDMzLjYyMSA0LjU3OTUKICAgMzQuNDA0IDQuNTc5NUMzNi43OTggNC41NzIgMzkuMDk2IDUuNTE4NSA0MC43ODk1IDcuMjEwNUM0My4xNDE1IDkuNTYxIDQzLjkxMSAKICAgMTIuOTEwNSA0My4xMjA1IDE1LjkyNTVDNDYuMDE1NSAxNy40NjE1IDQ4IDIwL
        jUwOCA0OCAyNEM0OCAyNy40OTIgNDYuMDE3IDMwLjUzNwogICAgNDMuMTIzNSAzMi4wNzZDNDMuOTE0IDM1LjA5MSA0My4xNDE1IDM4LjQzOSA0MC43ODk1IDQwLjc5MUMzOS4wOTYgNDIuNDgzIAogICAgMzYuNzk5NSA0My40Mjk1IDM0LjQwNTUgNDMuNDIyQzMzLjYxOTUgNDMuNDIyIDMyLjgzNjUgNDMuMz
        IgMzIuMDc2IDQzLjEyMDVDMzAuNTM3CiAgICAgNDYuMDE1NSAyNy40OTA1IDQ4IDI0IDQ4QzIwLjUwOTUgNDggMTcuNDYzIDQ2LjAxNTUgMTUuOTI0IDQzLjEyMDVDMTUuMTYyIDQzLjMyCiAgICAgIDE0LjM3OSA0My40MjA1IDEzLjU5NiA0My40MjA1QzExLjIwMiA0My40MjggOC45MDQgNDIuNDgxNSA3LjI
        xMDUgCiAgICAgIDQwLjc4OTVDNC44NTg1IDM4LjQzOSA0LjA4OSAzNS4wODk1IDQuODc5NSAzMi4wNzQ1QzEuOTg0NSAzMC41Mzg1CiAgICAgICAwIDI3LjQ5MiAwIDI0QzAgMjAuNTA4IDEuOTgzIDE3LjQ2MyA0Ljg3NjUgMTUuOTI0QzQuMDg2IDEyLjkwOQogICAgICAgIDQuODU4NSA5LjU2MSA3LjIxMDUgN
        y4yMDlDOC45MDQgNS41MTg1IDExLjIwMDUgNC41NzA1IDEzLjU5MwogICAgICAgIDQuNTc4QzE0LjM3NzUgNC41NzggMTUuMTYyIDQuNjggMTUuOTI0IDQuODc5NUMxNy40NjMKICAgICAgICAxLjk4NDUgMjAuNTA5NSAwIDI0IDBaTTMzLjQ3NyAxNi4zMzVMMjAuNTcxIDI5LjI0MUwxNC41MjMKICAgICAgICA
        gMjMuMTkxNUwxMi45MDYgMjQuODA4NUwyMC41NzEgMzIuNDczNUwzNS4wOTQgMTcuOTUwNUwzMy40NzcgMTYuMzM1WiIgCiAgICAgICAgIGZpbGw9IiMxNDkyNTMiCiAgICAgICAgIC8+Cjwvc3ZnPgo="
                    alt="Success"
                />

                    <h1 className="success-title">Thank You For Your Purchase!</h1>
                    
                    <p className="order-number">
                        Order Number: <strong>#INDUSTRA-{orderId || 'PENDING'}</strong>
                    </p>

                    <p className="success-message">
                        Your order has been placed successfully. We'll send you a confirmation email shortly.
                    </p>

                    <div className="invoice-section">
                        <h2>Order Invoice</h2>
                        
                        <div className="invoice-items">
                            {cartItems && cartItems.map((item, index) => (
                                <div key={index} className="invoice-item">
                                    <img src={item.image_url} alt={item.name} className="invoice-item-image" />
                                    <div className="invoice-item-details">
                                        <h4>{item.name}</h4>
                                        <p>Quantity: {item.quantity}</p>
                                    </div>
                                    <div className="invoice-item-price">
                                        ${((parseFloat(item.price) || 0) * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="invoice-totals">
                            <div className="invoice-row">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            {couponApplied && discountAmount > 0 && (
                                <div className="invoice-row discount">
                                    <span>Discount ({isShippingDiscount ? '$7.00' : `${discountPercent}%`}{couponCode ? ` - ${couponCode}` : ''})</span>
                                    <span>-${discountAmount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="invoice-row">
                                <span>Shipping</span>
                                <span>${shippingCost.toFixed(2)}</span>
                            </div>
                            <div className="invoice-row">
                                <span>Tax (10% IL)</span>
                                <span>${taxAmount.toFixed(2)}</span>
                            </div>
                            <div className="invoice-row total">
                                <span>Total Paid</span>
                                <span>${totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <Link to="/" className="continue-shopping-btn">
                        Continue Shopping
                    </Link>

                    <div className="order-info">
                        <p className="disclaimer">
                            INDUSTRA will never contact you to offer products, cash or free prizes.
                            Please do not respond, make payments or share your personal information 
                            like CVV, PIN or passwords via a call, WhatsApp or other links.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ThankYOu