import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { orderAPI } from "../../utils/api";
import "./OrderDetail.css";

function OrderDetail() {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        loadOrderDetail();
    }, [id]);

    const loadOrderDetail = async () => {
        try {
            const response = await orderAPI.getOrderById(id);
            setOrder(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error loading order:', error);
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const statusColors = {
            'completed': 'status-completed',
            'pending': 'status-pending',
            'shipped': 'status-shipped',
            'delivered': 'status-delivered',
            'cancelled': 'status-cancelled'
        };
        return statusColors[status] || 'status-pending';
    };

    if (loading) {
        return (
            <div className="order-detail-container">
                <div className="loading-spinner">Loading order details...</div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="order-detail-container">
                <div className="error-message">
                    <h2>Order Not Found</h2>
                    <p>The order you're looking for doesn't exist or you don't have access to it.</p>
                    <button className="back-btn" onClick={() => navigate('/orders')}>
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="order-detail-container">
            <div className="order-detail-header">
                <button className="back-btn" onClick={() => navigate('/orders')}>
                    <span className="material-symbols-outlined">arrow_back</span>
                    Back to Orders
                </button>
                <div className="order-header-info">
                    <h1>Order #INDUSTRA-{order.id}</h1>
                    <span className={`status-badge ${getStatusBadge(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                </div>
                <p className="order-date">Placed on {formatDate(order.created_at)}</p>
            </div>

            <div className="order-detail-content">
                <div className="order-items-section">
                    <h2>Order Items</h2>
                    <div className="items-list">
                        {order.items && order.items.map((item, index) => (
                            <div key={index} className="order-item-detail">
                                <img 
                                    src={item.image_url || '/images/placeholder.png'} 
                                    alt={item.name || 'Product'}
                                />
                                <div className="item-info">
                                    <h3>{item.name || 'Product'}</h3>
                                    <p className="item-category">Category: {item.category}</p>
                                    <p className="item-id">Product ID: {item.product_id}</p>
                                </div>
                                <div className="item-pricing">
                                    <p className="item-quantity">Qty: {item.quantity}</p>
                                    <p className="item-unit-price">${parseFloat(item.price_at_purchase).toFixed(2)} each</p>
                                    <p className="item-total-price">${(item.price_at_purchase * item.quantity).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="order-summary-section">
                    <div className="summary-card">
                        <h2>Order Summary</h2>
                        <div className="summary-row">
                            <span>Subtotal:</span>
                            <span>${parseFloat(order.total_amount).toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping:</span>
                            <span>$7.00</span>
                        </div>
                        <div className="summary-row">
                            <span>Tax (10%):</span>
                            <span>${(parseFloat(order.total_amount) * 0.10).toFixed(2)}</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total:</span>
                            <strong>${(parseFloat(order.total_amount) + 7 + (parseFloat(order.total_amount) * 0.10)).toFixed(2)}</strong>
                        </div>
                    </div>

                    <div className="order-actions">
                        <button 
                            className="action-btn primary"
                            onClick={() => navigate('/products')}
                        >
                            <span className="material-symbols-outlined">shopping_cart</span>
                            Shop Again
                        </button>
                        <button 
                            className="action-btn secondary"
                            onClick={() => window.print()}
                        >
                            <span className="material-symbols-outlined">print</span>
                            Print Receipt
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetail;
