import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { restChange } from "../utils/restSlice";

function TopRestaurant({ content, title }) {
  const scrollRef = useRef(null);
  const dispatch = useDispatch();
  const CartData = useSelector((state) => state.cartSlice.cartItem);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft) + clientWidth < scrollWidth);
    }
  };

  useEffect(() => {
    checkScroll();
  }, [content]);

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.querySelector('.flex-shrink-0').offsetWidth + 16;
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.querySelector('.flex-shrink-0').offsetWidth + 16;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  function HandleRestrant(info, element, link) {
    if (CartData.length === 0) {
      dispatch(restChange({ info, element, link }));
    }
  }

  return (
    <div className="w-full flex flex-col p-4 md:p-8 ">
      <div className="flex justify-between mb-8">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold ">{title}</h1>
        <div className="flex gap-3 sm:gap-5 items-center">
          <div
            onClick={handleScrollLeft}
            className={`rounded-full w-9 h-9 flex justify-center items-center cursor-pointer transition-colors duration-200 ${canScrollLeft ? 'bg-gray-300 hover:bg-gray-400' : 'bg-gray-200 text-gray-400'}`}
          >
            <i className="fi fi-rr-arrow-small-left text-2xl mt-1"></i>
          </div>
          <div
            onClick={handleScrollRight}
            className={`rounded-full w-9 h-9 flex justify-center items-center cursor-pointer transition-colors duration-200 ${canScrollRight ? 'bg-gray-300 hover:bg-gray-400' : 'bg-gray-200 text-gray-400'}`}
          >
            <i className="fi fi-rr-arrow-small-right text-2xl mt-1"></i>
          </div>
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-scroll styled-scrollbar"
        >
          {content?.map(({ info, cta: { link } }, index) => {
            link = link.split("/").at(-1);
            let string = "https://media-assets.swiggy.com/swiggy/image/upload/";
            let element = string + info.cloudinaryImageId;
            let dummy = "";
            return (
              <Link to={`restaurant/${link}`} key={index}>
                <div className="w-[280px] flex-shrink-0 hover:scale-95 duration-250" onClick={() => HandleRestrant(info, element, link)}>
                  <div className="w-full h-[180px] overflow-hidden rounded-2xl relative">
                    <img
                      src={element}
                      className="w-full h-full object-cover object-center"
                      alt=""
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent"></div>
                    <p className="absolute bottom-0 text-white font-bold ml-2 mb-1 text-xl">
                      {info?.aggregatedDiscountInfoV3?.header || " "}{" "}
                      {info?.aggregatedDiscountInfoV3?.subHeader || " "}
                    </p>
                  </div>
                  <div className="p-2 h-[110px]">
                    <p className="truncate w-full font-bold text-lg">{info?.name}</p>
                    <div className="flex gap-1 items-center mt-1">
                      <i className="fi fi-ss-circle-star text-green-700 text-base"></i>
                      <p className="font-medium">{info.avgRating}</p>
                      <i className="fi fi-ss-bullet text-xs"></i>
                      <p className="font-semibold">{info.sla?.slaString}</p>
                    </div>
                    <p className="truncate w-full text-gray-600 text-sm mt-1">
                      {info?.cuisines.map((val, i) => {
                        if (i === 0) dummy = val;
                        else dummy = dummy + ", " + val;
                        return null;
                      })}
                      {dummy}
                    </p>
                    <p className="text-gray-600 text-sm">{info?.areaName}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <hr className="border-b-2 border-gray-200 mt-10" />
      </div>
    </div>
  );
}

export default TopRestaurant;