import "./singleProductpage.css"
import { FaStar } from 'react-icons/fa';
import { FaStarHalf } from 'react-icons/fa';
import { BiStoreAlt } from 'react-icons/bi';
import { HiOutlineShoppingCart } from 'react-icons/hi';
import { useEffect, useState } from "react";
import Loading from "./loading";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { cartAPI } from "../../utils/api";

function SingleProduct() {
    const { isSignedIn } = useUser();
    const isauth = isSignedIn;
    let [avail, setAvail] = useState(false)
    let [addingToCart, setAddingToCart] = useState(false)
    const [quantity, setQuantity] = useState(1);
    let navigate = useNavigate()

    const handleIncrement = () => setQuantity(prev => prev + 1);
    const handleDecrement = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

    const { id, category } = useParams()
    const [obj, setObj] = useState({
        id: null,
        name: "",
        brand: "",
        category: "",
        main_category: "",
        price: "0",
        image_url: "",
        description: "",
        specifications: {},
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        fetch(`${apiUrl}/products/category/${category}/${id}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setLoading(false)
                setObj(data)
            })
            .catch((error) => {
                console.error('Error fetching product:', error);
                setLoading(false);
            })
    }, [id, category])

    const [availability, setAvailbility] = useState('')

    function checkDelivery() {
        setAvailbility("Yes Delivery Available at your Location")
    }

    console.log(availability);
    async function addToCart() {
        if (!isauth) return;

        setAddingToCart(true);
        try {
            // Determine category slug from the URL params
            await cartAPI.addToCart(obj.id, category, quantity);
            window.dispatchEvent(new Event('cartUpdated'));
            setAvail(false);
        } catch (error) {
            console.error('Error adding to cart:', error);
            if (error.response?.status === 409) {
                setAvail(true);
            }
        } finally {
            setAddingToCart(false);
        }
    }
    return (
        <>
            {loading ? <Loading /> :
                <div className="Parent1">
                    <p style={{ color: "gray", fontSize: "14px" }}>Products {">"} {obj.main_category} {">"} {obj.category} {">"} {obj.name} </p>
                    <div className="Container1">
                        <div>
                            <div className="productImg1">
                                <img src={obj.image_url || "/images/placeholder.jpg"} alt={obj.category} />
                                <img src={obj.image_url || "/images/placeholder.jpg"} alt={obj.category} />
                            </div>
                            <div className="about1">{obj.description}</div>
                        </div>

                        <div>
                            <h3 style={{ margin: "0px" }}>{obj.name}</h3>
                            <p style={{ marginTop: "5px", marginBottom: "5px" }}>{obj.category}</p>
                            {obj.brand && <p style={{ fontSize: "14px", color: "gray" }}>Brand: {obj.brand}</p>}

                            <h3>$ <span style={{ fontSize: "30px", fontWeight: "bolder" }}>{parseFloat(obj.price).toFixed(2)}</span></h3>
                            <p style={{ marginTop: "-10px", fontSize: "13px", color: "rgb(94, 94, 94)" }}>Price incl. of all taxes</p>
                            <p style={{ marginTop: "-10px", fontSize: "13px", color: "rgb(94, 94, 94)" }}>Price valid Dec 15 - Jan 15 or while supply lasts</p>

                            {obj.specifications?.availability && (
                                <p style={{ fontSize: "13px", color: "orange", fontWeight: "bold" }}>{obj.specifications.availability}</p>
                            )}

                            <div className="product-policy" style={{ margin: "10px 0", color: "#28a745", fontWeight: "bold" }}>
                                <i className="fas fa-undo" style={{ marginRight: "5px" }}></i>
                                Return within 30 days
                            </div>

                            <span>
                                <div className="abc1">
                                    {/* Fake Random Reviews */}
                                    {(() => {
                                        // Generate deterministic random number based on product ID
                                        const pseudoRandom = (seed) => {
                                            const x = Math.sin(seed) * 10000;
                                            return x - Math.floor(x);
                                        };
                                        const seed = obj.id ? parseInt(obj.id) : 123;
                                        const rating = 3.5 + (pseudoRandom(seed) * 1.5); // 3.5 to 5.0
                                        const reviewCount = Math.floor(10 + pseudoRandom(seed + 1) * 100);

                                        return (
                                            <>
                                                <div style={{ color: "#ffc107", marginRight: "5px" }}>
                                                    {[...Array(5)].map((_, i) => (
                                                        <FaStar key={i} color={i < Math.round(rating) ? "#ffc107" : "#e4e5e9"} />
                                                    ))}
                                                </div>
                                                <p style={{ fontSize: "13px", margin: 0 }}>({reviewCount} reviews)</p>
                                            </>
                                        );
                                    })()}
                                </div>
                            </span>
                            <div className="quantity-selector" style={{ margin: "20px 0", display: "flex", alignItems: "center", gap: "15px" }}>
                                <p style={{ margin: 0, fontWeight: "bold" }}>Quantity:</p>
                                <div style={{ display: "flex", alignItems: "center", border: "1px solid #ccc", borderRadius: "5px" }}>
                                    <button onClick={handleDecrement} style={{ border: "none", background: "#f0f0f0", padding: "5px 15px", fontSize: "18px", cursor: "pointer", borderRadius: "5px 0 0 5px" }}>-</button>
                                    <span style={{ padding: "0 15px", fontWeight: "bold", fontSize: "16px" }}>{quantity}</span>
                                    <button onClick={handleIncrement} style={{ border: "none", background: "#f0f0f0", padding: "5px 15px", fontSize: "18px", cursor: "pointer", borderRadius: "0 5px 5px 0" }}>+</button>
                                </div>
                            </div>

                            <div className="delivey1">
                                {obj.address ? (
                                    <div><p style={{ marginTop: "10px", fontSize: "14px", color: "Green" }}>Delivery to {obj.address} within 2 days</p></div>
                                ) : (
                                    <div><p style={{ marginTop: "10px", fontSize: "14px", color: "Orange" }}>Please add address for delivery options</p></div>
                                )}
                            </div>
                            <button onClick={addToCart} className="addToCart1" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" disabled={addingToCart}>
                                <HiOutlineShoppingCart /> {addingToCart ? 'Adding...' : 'Add to Cart'}
                            </button>
                            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog">
                                    <div class="modal-content">


                                        <div style={{ color: "white", backgroundColor: "rgb(19, 80, 116)" }} class="modal-body">
                                            <h3 style={{}}>{isauth ? (!avail ? obj.name + " Added to Cart" : "Item already added") : "You have to Login first"}</h3>
                                        </div>
                                        <div class="modal-footer">
                                            <button onClick={() => { isauth ? navigate("/cart") : navigate("/login") }} type="button" data-bs-dismiss="modal" class="btn btn-primary">{isauth ? "Go to cart" : "login"}</button>
                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>}
        </>
    )
}

export default SingleProduct