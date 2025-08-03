import React, { useContext, useState } from 'react'
import OnYourMind from './OnYourMind'
import TopRestaurant from './TopRestaurant'
import RestaurantOnline from './RestaurantOnline';
import { useEffect } from 'react';
import { Coordinates } from '../../context/ContextApi';
import { useSelector } from 'react-redux';

function Body() {
  const [OnYourMindData, setOnYourMindData] = useState([]);
  const [TopRestaurantData, setTopRestaurantData] = useState([]);
  const [title, setTitle] = useState("");
  const [heading, setHeading] = useState("");
  const { coord: { lat, long } } = useContext(Coordinates);

  const filterVal = useSelector((state) => state?.filterSlice?.filterVal);

  const filteredData = TopRestaurantData?.filter((item) => {
    if (!filterVal) return true;

    switch (filterVal) {
      case "Ratings 4.0+":
        return item?.info?.avgRating > 4;
      case "Rs. 300-Rs. 600":{
        const cost = item?.info?.costForTwo?.replace('₹', '').split(' ')[0];
        return cost && parseInt(cost) >= 300 && parseInt(cost) <= 600;}
      case "Offers":
        return (
          item?.info?.id
        );
      case "Less than Rs. 300":{
        const costLess = item?.info?.costForTwo?.replace('₹', '').split(' ')[0];
        return costLess && parseInt(costLess) < 300;}
      default:
        return true;
    }
  });

  async function fetchcontent() {
    try {
      const data = await fetch(
        `https://www.swiggy.com/dapi/restaurants/list/v5?lat=${lat}&lng=${long}&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING`
      );
      const result = await data.json();
      
      const onYourMind = result?.data?.cards[0]?.card?.card?.imageGridCards?.info || [];
      const topRestaurants = result?.data?.cards[1]?.card?.card?.gridElements?.infoWithStyle?.restaurants || [];
      const restaurantOnlineTitle = result?.data?.cards[2]?.card?.card?.title || '';
      const topRestaurantTitle = result?.data?.cards[1]?.card?.card?.header?.title || '';
      
      setOnYourMindData(onYourMind);
      setTopRestaurantData(topRestaurants);
      setTitle(topRestaurantTitle);
      setHeading(restaurantOnlineTitle);
    } catch (error) {
      console.error("Failed to fetch content:", error);
      // Fallback to empty arrays to prevent app from crashing
      setOnYourMindData([]);
      setTopRestaurantData([]);
      setTitle("");
      setHeading("");
    }
  }

  useEffect(() => {
    fetchcontent();
  }, [lat, long]);

  // Conditional rendering to prevent errors when data is not yet fetched
  if (TopRestaurantData.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className='w-full max-w-7xl mx-auto'>
      <OnYourMind content={OnYourMindData}></OnYourMind>
      <TopRestaurant content={TopRestaurantData} title={title}></TopRestaurant>
      <RestaurantOnline content={filterVal ? filteredData : TopRestaurantData} title={heading}></RestaurantOnline>
    </div>
  );
}

export default Body;