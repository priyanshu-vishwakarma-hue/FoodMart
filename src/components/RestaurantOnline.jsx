import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setFilterValue } from "../utils/filterSlice";
import {restChange} from "../utils/restSlice";
import { useSelector } from "react-redux";


function RestaurantOnline({content,title}) {

  const filterOptions = ["Ratings 4.0+","Rs. 300-Rs. 600","Offers","Less than Rs. 300",]
  const CartData=useSelector((state)=>state.cartSlice.cartItem)
  const [activeBtn, setActiveBtn ] = useState(null)

  const dispatch = useDispatch()

  function handleFilterBtn (filterName) {
      setActiveBtn(activeBtn === filterName  ? null : filterName)
  }
  dispatch(setFilterValue(activeBtn))


  function HandleRestrant (info,element,link) {
    // console.log(info,element,link)
    if(CartData.length==0)dispatch(restChange({info,element,link}));
  }
  

  return (
    <div className="w-full flex flex-col  mt-10">

      <h1 className=" text-[21px] font-extrabold mb-5">
          {title}
      </h1>

      <div className="my-7 flex flex-wrap gap-3">
        {
          filterOptions.map((filterName,i) => (
              <button key={i} onClick={() => handleFilterBtn(filterName)} className={"filterBtn flex gap-2 " + (activeBtn === filterName ? "active" : "")}>
                  <p>{filterName}</p>
                  <i className="fi text-sm mt-1 fi-br-cross hidden"></i>
              </button>
          ))
        }
      </div>

      <div className="w-full grid grid-cols-4 place-items-center ">
        {content?.map(({ info, cta: { link } }) => {
          link = link.split("/").at(-1);
          let string = "https://media-assets.swiggy.com/swiggy/image/upload/";
          let element = string + info.cloudinaryImageId;
          let dummy = "";
          return (
            <Link to={`restaurant/${link}`} >
              <div className="w-[280px] h-[300px] hover:scale-95 duration-250 mb-7"  onClick={()=>HandleRestrant(info,element,link)}>
                <div className="w-full h-[180px] overflow-hidden rounded-2xl relative ">
                  <img
                    src={element}
                    className=" w-full h-full object-cover object-center "
                    alt=""
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 via-20% to-transparent to-50%"></div>
                  <p className="absolute bottom-0 text-white font-bold ml-2 mb-1 text-xl">
                    {info?.aggregatedDiscountInfoV3?.header || " "}{" "}
                    {info?.aggregatedDiscountInfoV3?.subHeader || " "}
                  </p>
                </div>
                <div className="p-2 h-[110px]">
                  <p className="truncate w-full font-bold text-[18px]">
                    {info?.name}
                  </p>
                  <div className="flex gap-0.5">
                    <i className="fi fi-ss-circle-star text-green-700 text-[18px]"></i>
                    <p className="font-medium">{info.avgRating}</p>
                    <i className="fi fi-ss-bullet mt-0.5"></i>
                    <p className="font-semibold">{info.sla?.slaString}</p>
                  </div>
                  <p className="truncate w-full text-gray-600 text-[16px]">
                    {info?.cuisines.map((val, i) => {
                      if (i == 0) dummy = val;
                      else dummy = dummy + ", " + val;
                    })}
                    {dummy}
                  </p>
                  <p className="text-gray-600 text-[16px]">
                    {info?.areaName}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
        <hr className="border-b-2 border-gray-200 mt-15 " />
      </div>
    </div>
  );
}

export default RestaurantOnline