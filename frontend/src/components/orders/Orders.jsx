import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { orderAPI } from "../../utils/api";
import "./Orders.css";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const response = await orderAPI.getOrders();
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error loading orders:', error);
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
            <div className="orders-container">
                <div className="loading-spinner">Loading your orders...</div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="orders-container">
                <div className="orders-header">
                    <h1>My Orders</h1>
                </div>
                <div className="empty-orders">
                    <img 
                        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTUwIDEwQzI3LjkwOSAxMCAxMCAyNy45MDkgMTAgNTBDMTAgNzIuMDkxIDI3LjkwOSA5MCA1MCA5MEM3Mi4wOTEgOTAgOTAgNzIuMDkxIDkwIDUwQzkwIDI3LjkwOSA3Mi4wOTEgMTAgNTAgMTBaTTUwIDgwQzMzLjQzMSA4MCAyMCA2Ni41NjkgMjAgNTBDMjAgMzMuNDMxIDMzLjQzMSAyMCA1MCAyMEM2Ni41NjkgMjAgODAgMzMuNDMxIDgwIDUwQzgwIDY2LjU2OSA2Ni41NjkgODAgNTAgODBaIiBmaWxsPSIjY2NjIi8+CiAgPHBhdGggZD0iTTM1IDQwSDY1VjQ1SDM1VjQwWk0zNSA1MEg2NVY1NUgzNVY1MFpNMzUgNjBINjVWNjVIMzVWNjBaIiBmaWxsPSIjY2NjIi8+Cjwvc3ZnPgo=" 
                        alt="No Orders"
                    />
                    <h2>No Orders Yet</h2>
                    <p>You haven't placed any orders yet.</p>
                    <button 
                        className="shop-now-btn"
                        onClick={() => navigate('/products')}
                    >
                        Start Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-container">
            <div className="orders-header">
                <h1>My Orders</h1>
                <p className="orders-count">{orders.length} {orders.length === 1 ? 'Order' : 'Orders'}</p>
            </div>

            <div className="orders-list">
                {orders.map((order) => (
                    <div key={order.id} className="order-card">
                        <div className="order-card-header">
                            <div className="order-info">
                                <h3>Order #INDUSTRA-{order.id}</h3>
                                <p className="order-date">{formatDate(order.created_at)}</p>
                            </div>
                            <div className="order-status">
                                <span className={`status-badge ${getStatusBadge(order.status)}`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                            </div>
                        </div>

                        <div className="order-items">
                            {order.items && order.items.slice(0, 3).map((item, index) => (
                                <div key={index} className="order-item-preview">
                                    <img 
                                        src={item.image_url || '/images/placeholder.png'} 
                                        alt={item.name || 'Product'}
                                    />
                                    <div className="item-details">
                                        <p className="item-name">{item.name || 'Product'}</p>
                                        <p className="item-quantity">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="item-price">${(item.price_at_purchase * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                            {order.items && order.items.length > 3 && (
                                <p className="more-items">+{order.items.length - 3} more items</p>
                            )}
                        </div>

                        <div className="order-card-footer">
                            <div className="order-total">
                                <span>Total:</span>
                                <strong>${parseFloat(order.total_amount).toFixed(2)}</strong>
                            </div>
                            <button 
                                className="view-details-btn"
                                onClick={() => navigate(`/orders/${order.id}`)}
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Orders;
