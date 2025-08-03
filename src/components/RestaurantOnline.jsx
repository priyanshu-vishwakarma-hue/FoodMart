import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setFilterValue } from "../utils/filterSlice";
import { restChange } from "../utils/restSlice";

function RestaurantOnline({ content, title }) {
  const filterOptions = ["Ratings 4.0+", "Rs. 300-Rs. 600", "Offers", "Less than Rs. 300"];
  const CartData = useSelector((state) => state.cartSlice.cartItem);
  const [activeBtn, setActiveBtn] = useState(null);
  const dispatch = useDispatch();

  function handleFilterBtn(filterName) {
    setActiveBtn(activeBtn === filterName ? null : filterName);
  }
  dispatch(setFilterValue(activeBtn));

  function HandleRestrant(info, element, link) {
    if (CartData.length === 0) {
      dispatch(restChange({ info, element, link }));
    }
  }

  return (
    <div className="w-full flex flex-col p-4 md:p-8">
      <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold mb-5">
        {title}
      </h1>

      <div className="my-7 flex flex-wrap gap-3">
        {filterOptions.map((filterName, i) => (
          <button
            key={i}
            onClick={() => handleFilterBtn(filterName)}
            className={
              "filterBtn flex gap-2 " +
              (activeBtn === filterName ? "active" : "")
            }
          >
            <p>{filterName}</p>
            <i className="fi text-sm mt-1 fi-br-cross hidden"></i>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {content?.map(({ info, cta: { link } }, index) => {
          link = link.split("/").at(-1);
          const imageURL = "https://media-assets.swiggy.com/swiggy/image/upload/" + info.cloudinaryImageId;
          let dummy = "";

          return (
            <Link to={`restaurant/${link}`} key={index}>
              <div
                className="flex flex-col hover:scale-95 transition-transform duration-300 bg-white rounded-2xl overflow-hidden shadow-md h-full"
                onClick={() => HandleRestrant(info, imageURL, link)}
              >
                {/* Image container */}
                <div className="w-full h-48 md:h-52 lg:h-56 relative">
                  <img
                    src={imageURL}
                    alt=""
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
                  <p className="absolute bottom-0 text-white font-bold ml-2 mb-1 text-sm md:text-base">
                    {info?.aggregatedDiscountInfoV3?.header || " "}
                    {" "}
                    {info?.aggregatedDiscountInfoV3?.subHeader || " "}
                  </p>
                </div>

                {/* Content */}
                <div className="p-3 flex flex-col justify-between h-[140px]">
                  <p className="font-bold text-base md:text-lg truncate">{info?.name}</p>
                  <div className="flex gap-1 items-center text-sm mt-1">
                    <i className="fi fi-ss-circle-star text-green-700"></i>
                    <p>{info.avgRating}</p>
                    <i className="fi fi-ss-bullet text-xs"></i>
                    <p>{info.sla?.slaString}</p>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {info?.cuisines.map((val, i) => {
                      if (i === 0) dummy = val;
                      else dummy += ", " + val;
                      return null;
                    })}
                    {dummy}
                  </p>
                  <p className="text-gray-500 text-sm">{info?.areaName}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default RestaurantOnline;
