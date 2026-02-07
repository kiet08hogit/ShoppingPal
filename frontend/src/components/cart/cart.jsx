import "./cart.css"
import { BsChevronDown } from 'react-icons/bs';
import { FiPrinter } from 'react-icons/fi';
import { useState } from "react";
import { useEffect } from 'react';
import CartProduct from "./singleCartProduct";
import EmptyCart from "./emptyCart";
import {TbTruckDelivery} from "react-icons/tb"
import {MdOutlineAdsClick} from "react-icons/md"
import {GrDeliver} from "react-icons/gr"
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { cartAPI } from "../../utils/api";


function Cart() {
    const { isSignedIn } = useUser();
    const isAuth = isSignedIn;
    let [input,setInput] = useState("")
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
            setCartItems(response.data.cart || []);
        } catch (error) {
            console.error('Error loading cart:', error);
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    }

    async function changeQuantity(value, productId) {
        try {
            await cartAPI.updateQuantity(productId, value);
            await loadCart();
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    }

    async function deleteItem(productId) {
        try {
            await cartAPI.removeFromCart(productId);
            await loadCart();
        } catch (error) {
            console.error('Error removing item:', error);
        }
    }

    let totalPrice = 0;
    
    if (loading) {
        return <div style={{textAlign: 'center', padding: '50px'}}>Loading cart...</div>;
    }

    return (
        <>
        {!isAuth?<EmptyCart/>:
        <div>
            <h3 style={{ textAlign: "center"}}> <span style={{textDecoration:"underline"}}>Shopping Cart</span>   <BsChevronDown /> <FiPrinter />  </h3>
            <div>
                {
                    cartItems.map((elem) =>
                    (
                        <CartProduct
                            key={elem.product_id}
                            price={elem.price}
                            name={elem.name}
                            detail={elem.details}
                            measurement={elem.measurement}
                            image={elem.image}
                            quantity={elem.quantity}
                            setq={changeQuantity}
                            del = {deleteItem}
                            id = {elem.product_id}
                        />
                    )
                    )
                }
            </div>
            {
                cartItems.length==0? <EmptyCart />:<div style={{padding:"30px 0px",borderBottom:"1px solid rgb(160, 159, 159)",width:"50%",margin:"auto"}} >
                <div className="subtotal">
                    {cartItems.map((elem) => {
                        totalPrice += (elem.price || 0) * elem.quantity
                    })}
                    <p>Subtotal</p>
                    <p>${totalPrice}</p>
                </div>

            </div>
            }
            <div className="placeOrder">
                <div className="greenColor">
                    <div style={{display:"flex",gap:"25px"}}>
                        <span style={{fontSize:"24px"}}><TbTruckDelivery /> </span>
                        <h5 style={{fontWeight:"bolder"}}>   Delivery details will be 
                        calculated in the
                        next page, 
                        please enter the pincode below to continue.</h5>
                    </div>
                    
                </div>
                <h3 style={{textAlign:"center",fontWeight:"bolder",marginTop:"30px"}}>How would you like to receive your order?</h3>
                <div style={{display:"flex",justifyContent:"space-around",borderBottom:"1px solid black"}}>
                    <div>
                        <p style={{fontSize:"40px",marginLeft:"25px"}}><GrDeliver /></p>
                        <p style={{color:"blue"}}>Home Delivery</p>
                    </div>
                    <div>
                        <p style={{fontSize:"40px",marginLeft:"35px"}}><MdOutlineAdsClick /></p>
                        <p>Click and Colloec</p>
                    </div>
                </div>
                <div style={{borderTop:"1px solid black",marginTop:"20px"}}>
                    <p>
                        Enter a PIN code to see product availability and delivery options.
                    </p>
                    <input value={input} onChange={(e)=>setInput(e.target.value)} style={{width:"100%",padding:"5px 0",fontSize:"25px"}} type="text" ></input><br></br>
                    <button onClick={()=>{
                        if(input.length==6) navigate("/checkout")
                        else{
                            alert("please enter a valid pincode")
                            setInput("")
                        }
                        
                    }} style={{marginTop:"10px",backgroundColor:"rgb(35, 71, 179)",width:"40%",color:"white",
                             padding:"15px",fontSize:"16px",border:"none"  }}>Proceed</button>
                </div>
            </div>
            
        </div>
        }
        </>
    )
}

export default Cart