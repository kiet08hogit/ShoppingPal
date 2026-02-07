import { useNavigate } from "react-router-dom"

function EmptyCart({isAuthenticated = false}){
    const navigate = useNavigate()
    return(
        <div style={{textAlign:"center", padding: "40px 20px"}}>
            <img style = {{width:"200px",border:"100px",marginBottom:"30px"}} src = "/images/empty_cart.png" alt="Empty cart" />
            <h2 style={{marginBottom: "15px"}}>Your cart is empty!</h2>
            {!isAuthenticated && <p style={{marginBottom: "20px"}}>Login to see what you already added</p>}
            <button onClick={()=>{navigate("/products")}} style={{width:"300px",backgroundColor:"rgb(19, 80, 116)",color:"white",
                            fontSize:"14px",border:"none",padding:"10px 30px",
                            cursor:"pointer",borderRadius:"6px"}}>Browse our products</button>
        </div>
    )
}
export default EmptyCart