import React, { useContext, useState } from 'react'
import OnYourMind from './OnYourMind'
import TopRestaurant from './TopRestaurant'
import RestaurantOnline from './RestaurantOnline';
import { useEffect } from 'react';
import { Coordinates } from '../../context/ContextApi';
import { useSelector } from 'react-redux';

function Body() {
  const[OnYourMindData,setOnYourMindData]= useState([]);
  const[TopRestaurantData,setTopRestaurantData]= useState([]);
  const[title,setTitle]=useState("");
  const[heading,setHeading]=useState("")
  const {coord:{lat,long}}=useContext(Coordinates)


  const filterVal = useSelector((state) => state?.filterSlice?.filterVal);


  const filteredData = TopRestaurantData.filter((item) => {
      if (!filterVal) return true;

      switch (filterVal) {
          case "Ratings 4.0+":
              return item?.info?.avgRating > 4;
          case "Rs. 300-Rs. 600":
              return (
                  item?.info?.costForTwo?.slice(1, 4) >= "300" &&
                  item?.info?.costForTwo?.slice(1, 4) <= "600"
              );
          case "Offers":
              return(
                item?.info?.id
              );
          case "Less than Rs. 300":
              return item?.info?.costForTwo?.slice(1, 4) < "300";
          default:
              return true;
      }
  });


   async function fetchcontent() {
      const data = await fetch(
        `https://www.swiggy.com/dapi/restaurants/list/v5?lat=${lat}&lng=${long}&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING`
      );
      const result = await data.json();
      setOnYourMindData(result?.data?.cards[0]?.card?.card?.imageGridCards?.info);
      setTopRestaurantData(result?.data?.cards[1]?.card?.card?.gridElements?.infoWithStyle?.restaurants);
      setTitle(result?.data?.cards[1]?.card?.card?.header?.title)
      setHeading(result?.data?.cards[2]?.card?.card?.title)
    }
    
    useEffect(() => {
      fetchcontent();
    }, [lat,long]);

    return (
      <div className='w-[80%] m-auto'>
        <OnYourMind content={OnYourMindData}></OnYourMind>
        <TopRestaurant content={TopRestaurantData} title={title}></TopRestaurant>
        <RestaurantOnline content={filterVal ? filteredData : TopRestaurantData} title={heading} ></RestaurantOnline>
      </div>
    )
}

export default Body