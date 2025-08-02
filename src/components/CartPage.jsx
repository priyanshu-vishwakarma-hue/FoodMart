import React from "react";
import { AddCartData } from "../../context/ContextApi";
import { SingleItem } from "./ExpandingItems";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../utils/cartSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function CartPage() {
  const CartData=useSelector((state)=>state.cartSlice.cartItem)
  const getRestInfo=useSelector((state)=>state.cartSlice.restInfo)
  const userData = useSelector((state) => state.authSlice.userData);
  const { info, element, link } = useSelector((state) => state.restSlice.restInfo);

  const dispatch=useDispatch();
  const navigate = useNavigate();

  function HandleClear(){
    dispatch(clearCart())
    toast.success("Cart Cleared", {
      duration: 1000,
      position: 'top-center',
      icon: "👍",
      style: {
        fontSize: "1.5rem",
        fontWeight: "bold",
        backgroundColor: "red",
        color: "white",
      }
    })
  }

  function HandlePlaceOrder(){
    if(userData) toast.success("ORDERED SUCCESSFULY")
    else{
      toast.error("login to order")
      navigate("/SignInPage")
    }
  }


  if (CartData.length == 0) {
    return (
      <div className="min-w-full min-h-[60vh] flex flex-col justify-center items-center ">
        <p className="text-[60px] text-red-500 font-bold bg-gray-200 p-4 px-10 rounded-2xl mb-[80px]">
          Nothing is in the Cart
        </p>
        <Link to={"/"}>
          <p className="text-[40px] text-gray-200 font-bold bg-red-900 p-2 px-5 rounded-2xl shadow-2xl hover:cursor-pointer hover:bg-red-700">
            restaurants
          </p>
        </Link>
      </div>
    );
  }

  let total = 0;
  let dummy = "";
  return (
    <div>
      {
        CartData.length > 0 && 
        <Link to={`/restaurant/${link}`} >
          <div className="w-[900px] h-[300px] hover:scale-98 duration-250 m-auto flex justify-center gap-2 my-5">
            <div className="min-w-[400px] h-[300px] overflow-hidden rounded-4xl relative ">
              <img
                src={element}
                className=" w-full h-full object-cover object-center "
                alt=""
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 via-20% to-transparent to-50%"></div>
              <p className="absolute bottom-0 text-white font-bold ml-2 mb-1 text-[30px]">
                {info?.aggregatedDiscountInfoV3?.header || " "}{" "}
                {info?.aggregatedDiscountInfoV3?.subHeader || " "}
              </p>
            </div>
            <div className="p-2 h-[110px] mt-[80px]">
              <p className="truncate w-full font-bold text-[30px]">
                {info?.name}
              </p>
              <div className="flex gap-0.5 text-2xl">
                <i className="fi fi-ss-circle-star text-green-700 mt-1"></i>
                <p className="font-medium">{info.avgRating}</p>
                <i className="fi fi-ss-bullet mt-0.5"></i>
                <p className="font-semibold">{info.sla?.slaString}</p>
              </div>
              <p className="truncate w-full text-gray-600 text-[25px]">
                {info?.cuisines.map((val, i) => {
                  if (i == 0) dummy = val;
                  else dummy = dummy + ", " + val;
                })}
                {dummy}
              </p>
              <p className="text-gray-600 text-[25px]">
                {info?.areaName}
              </p>
            </div>
          </div>
        </Link>
      }
      <div className=" flex flex-col justify-center items-center ">
        <div>
          {CartData.map(
            ({
              value: {
                card: {
                  info: { price, finalPrice },
                },
              },
            }) => {
              total = total + price || finalPrice;
            }
          )}
          <h1 className=" text-2xl font-bold text-green-600 bg-amber-200 px-4 py-2 rounded-2xl shadow-xl">
            Total Price( ₹{total / 100} )
          </h1>
        </div>
        <div className="w-[800px]">
          {CartData.map(({ value }) => (
            <SingleItem value={value} flag={false} getRestInfo={getRestInfo} />
            // <div>hello</div>
          ))}
        </div>
        {<button className=' bg-red-800 p-[10px] w-[120px] text-[18px] rounded-xl font-extrabold text-white hover:cursor-pointer hover:bg-red-500 my-10' onClick={() => HandleClear()}>CLEAR</button>}
        {<button className=' bg-green-600 p-[10px] text-[18px] rounded-xl font-extrabold text-white hover:cursor-pointer hover:bg-green-700 mb-5' onClick={() => HandlePlaceOrder()}>PLACE ORDER</button>}
      </div>
    </div>
  );
}

export default CartPage;
