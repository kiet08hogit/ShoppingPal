import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "./checkout.css"
import { useUser } from "@clerk/clerk-react";
import { cartAPI } from "../../utils/api";

export default function Checkout() {
  let navigate = useNavigate()
  const { isSignedIn } = useUser();
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [couponCode, setCouponCode] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)
  const [discount, setDiscount] = useState(0)
  const [freeShipping, setFreeShipping] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [showCardForm, setShowCardForm] = useState(false)
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  })

  useEffect(() => {
    if (isSignedIn) {
      loadCart();
    } else {
      navigate('/login');
    }
  }, [isSignedIn, navigate])

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

  function applyCoupon() {
    const code = couponCode.toUpperCase().trim();
    
    const coupons = {
      'SAFETEAM15': { type: 'discount', value: 0.15, message: 'Coupon applied! You got 15% off on Bulk Safety Gear' },
      'POWER20': { type: 'discount', value: 0.20, message: 'Coupon applied! You got 20% off on Power Tools' },
      'FREESHIP': { type: 'discount', value: 7, message: 'Coupon applied! You got $7 shipping discount' },
      'CLEAN25': { type: 'discount', value: 0.25, message: 'Coupon applied! You got 25% off on Maintenance Supplies' }
    };
    
    if (coupons[code]) {
      const coupon = coupons[code];
      if (coupon.type === 'discount') {
        if (code === 'FREESHIP') {
          setDiscount(7);
        } else {
          setDiscount(coupon.value);
        }
        setFreeShipping(false);
      }
      setCouponApplied(true);
      alert(coupon.message);
    } else {
      alert("Invalid coupon code");
    }
  }

  function handlePaymentSelect(method) {
    if (method === 1) {
      setSelectedPayment(1);
      setShowCardForm(true);
    }
    // Methods 2, 3, 4 do nothing
  }

  function handleCardInputChange(e) {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      // Format card number with spaces: 1234 5678 9012 3456
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) return;
    } else if (name === 'expiryDate') {
      // Format expiry date: MM/YY
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      if (formattedValue.length > 5) return;
    } else if (name === 'cvv') {
      // Only numbers, max 4 digits
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 4) return;
    }

    setCardDetails({
      ...cardDetails,
      [name]: formattedValue
    });
  }

  // Calculate totals
  let subtotal = 0;
  cartItems.forEach(item => {
    subtotal += (parseFloat(item.price) || 0) * item.quantity;
  });

  const shippingCost = 7.00;
  const discountAmount = couponApplied 
    ? (couponCode && couponCode.toUpperCase() === 'FREESHIP' ? discount : subtotal * discount)
    : 0;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const taxRate = 0.10;
  const taxAmount = subtotalAfterDiscount * taxRate;
  const totalAmount = subtotalAfterDiscount + shippingCost + taxAmount;

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  }

  function handlePayment() {
    // Navigate to confirmation with order details
    navigate('/thankyou', {
      state: {
        cartItems,
        subtotal,
        shippingCost,
        taxAmount,
        discountAmount,
        totalAmount,
        couponApplied,
        couponCode,
        freeShipping
      }
    });
  }

  return (
    <div className="modern-checkout-container">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <div className="checkout-steps">
          <div className="step clickable" onClick={() => navigate('/checkout')}>1. Shipping</div>
          <div className="step active">2. Payment</div>
          <div className="step" style={{opacity: 0.5, cursor: 'not-allowed'}}>3. Confirmation</div>
        </div>
      </div>
      
      <div className="checkout-content">
        <div className="payment-section">
          <div className="section-card">
            <h2>Choose payment method</h2>
            <p>Choose the payment method you prefer</p>
            
            <div className="payment-options">
              <label className="payment-option" onClick={() => handlePaymentSelect(1)}>
                <input type="radio" name="payment" checked={selectedPayment === 1} readOnly />
                <div className="payment-option-content">
                  <span className="payment-label">Credit or Debit Card</span>
                  <div className="card-logos">
                    <img src="https://img.shop.com/Image/local/images/cc/visa.jpg" alt="Visa" />
                    <img src="https://img.shop.com/Image/local/images/cc/mastercard.png" alt="Mastercard" />
                    <img src="https://img.shop.com/Image/local/images/cc/amex.jpg" alt="Amex" />
                    <img src="https://img.shop.com/Image/local/images/cc/discover.jpg" alt="Discover" />
                  </div>
                </div>
              </label>

              <label className="payment-option disabled">
                <input type="radio" name="payment" disabled />
                <div className="payment-option-content">
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <span className="payment-label">PayPal</span>
                    <span className="maintenance-badge">Under Maintenance</span>
                  </div>
                  <img src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/checkout-logo-medium.png" alt="PayPal" className="paypal-logo" style={{opacity: 0.5}} />
                </div>
              </label>

              <label className="payment-option disabled">
                <input type="radio" name="payment" disabled />
                <div className="payment-option-content">
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <span className="payment-label">Cryptocurrency</span>
                    <span className="maintenance-badge">Under Maintenance</span>
                  </div>
                  <img src="https://bitpay.com/cdn/merchant-resources/bitpay-accepted-card-group.svg" alt="BitPay" className="crypto-logo" style={{opacity: 0.5}} />
                </div>
              </label>

              <label className="payment-option disabled">
                <input type="radio" name="payment" disabled />
                <div className="payment-option-content">
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <span className="payment-label">Pay in 4 installments</span>
                    <span className="maintenance-badge">Under Maintenance</span>
                  </div>
                  <img src="https://img.shop.com/Image/local/images/cc/SezzlePaymentBtn_Small-purple.svg" alt="Sezzle" className="sezzle-logo" style={{opacity: 0.5}} />
                </div>
              </label>
            </div>

            {showCardForm && (
              <div className="card-payment-form">
                <h3>Card Details</h3>
                <div className="card-form-grid">
                  <div className="form-group full-width">
                    <label>Card Number *</label>
                    <input
                      type="text"
                      name="cardNumber"
                      className="form-input"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.cardNumber}
                      onChange={handleCardInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group full-width">
                    <label>Cardholder Name *</label>
                    <input
                      type="text"
                      name="cardName"
                      className="form-input"
                      placeholder="JOHN DOE"
                      value={cardDetails.cardName}
                      onChange={handleCardInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Expiry Date *</label>
                    <input
                      type="text"
                      name="expiryDate"
                      className="form-input"
                      placeholder="MM/YY"
                      value={cardDetails.expiryDate}
                      onChange={handleCardInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>CVV *</label>
                    <input
                      type="text"
                      name="cvv"
                      className="form-input"
                      placeholder="123"
                      value={cardDetails.cvv}
                      onChange={handleCardInputChange}
                      required
                    />
                  </div>
                </div>
                
                <button 
                  type="button"
                  className="pay-btn" 
                  onClick={handlePayment}
                >
                  Place Order
                </button>
              </div>
            )}

            {!showCardForm && selectedPayment !== null && (
              <button 
                type="button"
                className="place-order-btn" 
                onClick={() => navigate("/thankyou", {
                  state: {
                    cartItems,
                    subtotal,
                    shippingCost,
                    taxAmount,
                    discountAmount,
                    totalAmount,
                    couponApplied,
                    couponCode,
                    freeShipping
                  }
                })}
              >
                Place Order
              </button>
            )}

            <div className="coupon-section">
              <h3>Have a coupon code?</h3>
              <div className="coupon-input-group">
                <input 
                  type="text" 
                  className="coupon-input"
                  placeholder="Enter coupon code (SAFETEAM15, POWER20, FREESHIP, CLEAN25)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  disabled={couponApplied}
                />
                <button 
                  className="coupon-apply-btn" 
                  onClick={applyCoupon}
                  disabled={couponApplied}
                >
                  {couponApplied ? 'Applied' : 'Apply'}
                </button>
              </div>
              {couponApplied && (
                <p className="coupon-success">✓ Coupon applied successfully!</p>
              )}
            </div>
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
              {couponApplied && discountAmount > 0 && (
                <div className="summary-row discount">
                  <span>Discount ({couponCode && couponCode.toUpperCase() === 'FREESHIP' ? '$7.00' : `${Math.round((discountAmount / subtotal) * 100)}%`}{couponCode ? ` - ${couponCode}` : ''})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Shipping</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax (10% IL)</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="order-note">
              <p>Let us know how we are doing</p>
              <a href="/feedback">Send Feedback</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
