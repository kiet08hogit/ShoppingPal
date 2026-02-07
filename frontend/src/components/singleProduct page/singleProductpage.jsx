import "./singleProductpage.css"
import { FaStar } from 'react-icons/fa';
import { FaStarHalf } from 'react-icons/fa';
import { BiStoreAlt } from 'react-icons/bi';
import { GrDeliver } from 'react-icons/gr';
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
    let navigate = useNavigate()

    const { id } = useParams()
    const [obj, setObj] = useState({
        mainImageUrl: "",
        contextualImageUrl: "",
        typeName: "",
        imageAlt: "",
        name: "",
        salesPrice: "",
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        fetch(`${apiUrl}/products/${id}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setLoading(false)
                setObj(data)
            })
    }, [])

    const [availability,setAvailbility] =useState('')

    function checkDelivery(){
        setAvailbility("Yes Delivery Available at your Location")
    }

console.log(availability);
    async function addToCart() {
        if (!isauth) return;
        
        setAddingToCart(true);
        try {
            await cartAPI.addToCart(obj.id, 1);
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
                    <p style={{ color: "gray", fontSize: "14px" }}>Products {">"} Furniture {">"} {obj.typeName} {">"} {obj.imageAlt} </p>
                    <div className="Container1">
                        <div>
                            <div className="productImg1">
                                <img src={obj.mainImageUrl} alt={obj.imageAlt} />
                                <img src={obj.contextualImageUrl} alt={obj.imageAlt} />
                            </div>
                            <div className="about1">{obj.about}</div>
                        </div>

                        <div>
                            <h3 style={{ margin: "0px" }}>{obj.name}</h3>
                            <p style={{ marginTop: "5px", marginBottom: "5px" }}>{obj.typeName}</p>

                            <h3>$ <span style={{ fontSize: "30px", fontWeight: "bolder" }}>{Math.trunc(obj.salesPrice.numeral) * 100 - 1}</span></h3>
                            <p style={{ marginTop: "-10px", fontSize: "13px", color: "rgb(94, 94, 94)" }}>Price incl. of all taxes</p>
                            <p style={{ marginTop: "-10px", fontSize: "13px", color: "rgb(94, 94, 94)gray" }}>Price valid Dec 15 - Jan 15 or while supply lasts</p>
                            <span>
                                <div className="abc1">
                                    <p>
                                        <FaStar />
                                        <FaStar />
                                        <FaStar />
                                        <FaStar />
                                        <FaStarHalf />
                                    </p>
                                    <p style={{ fontSize: "13px" }}>(142)</p>
                                </div>
                            </span>
                            <h4>How to get it</h4>
                            <div className="checkin1">
                                <div><p style={{ fontSize: "20px", marginLeft: "20px" }} ><BiStoreAlt /></p></div>
                                <div><p style={{ marginTop: "0px" }}>Check in-store stock</p></div>
                            </div>
                            <div className="pinCheck1">
                                <input type="text" placeholder="Enter pin code" />
                                <button onClick={checkDelivery} >Check</button>
                            </div>
                            <div className="delivey1">
                                <div><p style={{ fontSize: "25px" }} ></p></div>
                                <p></p>
                                <div><p style={{ marginTop: "10px", fontSize: "14px", color: "Green" }}>{availability}</p></div>
                            </div>
                            <button onClick={addToCart} className="addToCart1" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" disabled={addingToCart}>
                                <HiOutlineShoppingCart /> {addingToCart ? 'Adding...' : 'Add to Cart'}
                            </button>
                            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        

                                        <div style={{ color: "white", backgroundColor: "rgb(19, 80, 116)" }} class="modal-body">
                                            <h3 style={{}}>{isauth?(!avail ? obj.typeName + " Added to Cart" : "Item already added"):"You have to Login first"}</h3>
                                        </div>
                                        <div class="modal-footer">
                                            <button onClick={()=>{isauth ?  navigate("/cart"):navigate("/login")}} type="button" data-bs-dismiss="modal" class="btn btn-primary">{isauth?"Go to cart":"login"}</button>
                                            <button  type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            
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