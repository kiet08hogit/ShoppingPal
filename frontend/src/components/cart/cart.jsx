import "./cart.css"
import { useState } from "react";
import { useEffect } from 'react';
import CartProduct from "./singleCartProduct";
import EmptyCart from "./emptyCart";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { cartAPI } from "../../utils/api";


function Cart() {
    const { isSignedIn } = useUser();
    const isAuth = isSignedIn;
    let navigate = useNavigate()
    const [cartItems, setCartItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (isAuth) {
            loadCart();
        } else {
            setLoading(false);
        }
    }, [isAuth])

    async function loadCart() {
        try {
            const response = await cartAPI.getCart();
            // Backend returns { id, user_id, created_at, items: [...] }
            setCartItems(response.data.items || []);
        } catch (error) {
            console.error('Error loading cart:', error);
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    }

    async function changeQuantity(value, itemId) {
        try {
            await cartAPI.updateQuantity(itemId, value);
            window.dispatchEvent(new Event('cartUpdated'));
            await loadCart();
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    }

    async function deleteItem(itemId) {
        try {
            await cartAPI.removeFromCart(itemId);
            window.dispatchEvent(new Event('cartUpdated'));
            await loadCart();
        } catch (error) {
            console.error('Error removing item:', error);
        }
    }

    let totalPrice = 0;

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Loading cart...</div>;
    }

    return (
        <>
            {!isAuth ? <EmptyCart isAuthenticated={false} /> :
                <div className="cart-container">
                    <h1 className="cart-title">Shopping Cart</h1>

                    {cartItems.length === 0 ? <EmptyCart isAuthenticated={true} /> : (
                        <>
                            <div className="cart-items-section">
                                {cartItems.map((elem) => (
                                    <CartProduct
                                        key={elem.id}
                                        price={parseFloat(elem.price) || 0}
                                        name={elem.name}
                                        detail={elem.category}
                                        measurement=""
                                        image={elem.image_url}
                                        quantity={elem.quantity}
                                        setq={changeQuantity}
                                        del={deleteItem}
                                        id={elem.id}
                                    />
                                ))}
                            </div>

                            <div className="cart-summary">
                                <div className="summary-content">
                                    <div className="subtotal-row">
                                        {cartItems.map((elem) => {
                                            totalPrice += (parseFloat(elem.price) || 0) * elem.quantity;
                                            return null;
                                        })}
                                        <span className="subtotal-label">Subtotal:</span>
                                        <span className="subtotal-amount">${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="total-row">
                                        <span className="total-label">Total:</span>
                                        <span className="total-amount">${totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="cart-actions">
                                    <button
                                        className="continue-shopping-btn"
                                        onClick={() => navigate("/products")}
                                    >
                                        Continue Shopping
                                    </button>
                                    <button
                                        className="checkout-btn"
                                        onClick={() => navigate("/checkout")}
                                    >
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            }
        </>
    )
}

export default Cart