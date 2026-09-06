import "../../styles/propertyCard.css";
import HomeImg from "../../assets/Villa.jpg";

function Card(){
    return(

<div className=" col-12 col-md-6 col-lg-3">
<div className="card-property">
    <div className="upper-part">

<div className="on-miniCards">
        {/*type of purpose  */}
<div className="left">
    <span>
        for Rent
    </span>
    </div>    
    {/* ===================== */}
<div className="right">
    <i class="fa-regular fa-heart"></i>
    </div>    
</div>
<div className="img-outer">
    <img src={HomeImg} alt="estateImg" />
</div>
</div>


<div className="middle-part">
    {/*Location  */}
<div className="location">
<i class="fa-solid fa-location-dot"></i>
<h3>New Cairo</h3>
</div>
{/* ====================== */}

{/* Details */}
<div>
<p>Luxury Villa</p>
<p className="price">EGP 8,500,000</p>
</div>
{/* ================== */}

</div>

<div className="lower-part">
<div className="left">
    {/* bedRooms */}
<div className="bedRooms">
    <i class="fa-solid fa-bed"></i>
    5
</div>
{/* =========== */}

{/* bathRooms */}
<div className="bathRooms">
<i class="fa-solid fa-bath"></i>
    3
</div>

{/* ============== */}

{/* area */}
<div className="area">
160 sqm
</div>
{/* ============== */}
</div>

{/* time of post */}
<div className="right">
    <div className="time">2 days ago</div>
</div>
</div>

</div>



</div>




    );

}

export default Card;