import React, { useContext, useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { Coordinates } from '../../context/ContextApi'
import { useDispatch, useSelector } from "react-redux";
import { toggleSearchBar } from '../utils/toggleSlice';

function Navbar() {
    const[text,setText]=useState("");
    const[data,setData]=useState([]);
    const[description,setDescription]=useState("");
    const CartData=useSelector((state)=>state.cartSlice.cartItem)
    const userData = useSelector((state) => state.authSlice.userData);

    async function fetchData() {
        try {
            const temp = await fetch(`https://www.swiggy.com/dapi/misc/place-autocomplete?input=${text}`);
            if (!temp.ok) throw new Error('Network response was not ok');
            const result = await temp.json();
            setData(result.data);
        } catch (error) {
            console.error("Failed to fetch location data:", error);
        }
    }

    async function fetchCoord(id) {
        try {
            const temp = await fetch(`https://www.swiggy.com/dapi/misc/address-recommend?place_id=${id}`);
            if (!temp.ok) throw new Error('Network response was not ok');
            const result = await temp.json();
            setCoord({
                lat: result?.data[0]?.geometry?.location?.lat,
                long: result?.data[0]?.geometry?.location?.lng
            });
            setDescription(result?.data[0]?.formatted_address);
            ToggleVisible();
        } catch (error) {
            console.error("Failed to fetch coordinates:", error);
        }
    }
    
    useEffect(()=>{
        if(text) {
            fetchData();
        } else {
            setData([]);
        }
    },[text]);

    const visible=useSelector((state)=>state.toggleSlice.searchBarToggle);
    const dispatch=useDispatch();
    const {setCoord} =useContext(Coordinates)

    function ToggleVisible(){
        dispatch(toggleSearchBar());
        setText("");
    }

    const content=[
        {
            image: <i className="fi fi-rr-search pt-1 text-base md:text-xl"></i>,
            name: "Search",
            path: "search"
        },
        {
            image: <i className="fi fi-rs-badge-percent pt-1 text-base md:text-xl"></i>,
            name: "Offers",
            path: "offers"
        },
        {
            image: (userData? <img src={userData.photo} className='w-6 h-6 rounded-full' alt=""/> : <i className="fi fi-rs-user pt-1 text-base md:text-xl"></i>),
            name: (userData? userData.name : "Sign In"),
            path: "SignInPage"
        },
        {
            image: <i className="fi fi-rr-dolly-flatbed pt-1 text-base md:text-xl"></i>,
            name: "Cart",
            path: "Cart"
        }
    ]

    return (
        <div className='relative'>
            {/* Search Overlay & Sidebar */}
            <div className={`fixed inset-0 z-20 ${visible ? 'visible' : 'invisible'}`}>
                <div className="absolute inset-0 bg-black/70" onClick={ToggleVisible}></div>
                <div className={`absolute top-0 left-0 h-full bg-white z-30 transform transition-transform duration-500 ${visible ? 'translate-x-0' : '-translate-x-full'} w-full sm:w-[40%] md:w-[30%] max-w-lg`}>
                    <div className='p-8 flex flex-col'>
                        <i className="fi fi-bs-cross text-lg mb-8 hover:cursor-pointer" onClick={ToggleVisible}></i>
                        <input type="text" className='border-gray-300 border p-3 pl-5 w-full focus:outline-none focus:shadow-[0_0_10px_rgba(0,0,0,0.2)] font-semibold' 
                            onChange={(e)=>setText(e.target.value)}
                            value={text}
                            placeholder="Search for an area, street or city..."
                        />
                    </div>
                    <div className="px-8 overflow-y-auto max-h-[calc(100vh-16rem)]">
                        {
                            data?.map((val)=>(
                                <Link to={"/"} key={val.place_id} onClick={()=>fetchCoord(val.place_id)}>
                                    <div className='flex items-start py-4 border-b border-gray-200 hover:text-red-400'>
                                        <i className="fi fi-bs-marker text-gray-500 mt-1 pr-3"></i>
                                        <div className="flex-1 min-w-0">
                                            <h1 className='font-semibold truncate'>{val?.structured_formatting?.main_text}</h1>
                                            <h2 className='text-gray-500 text-sm truncate'>{val?.structured_formatting?.secondary_text}</h2>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        }
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <nav className='w-full h-20 shadow-md bg-white sticky top-0 z-10'>
                {/* Main Content Wrapper - Bounded & Centered */}
                <div className="flex justify-between items-center w-full max-w-7xl h-full mx-auto px-4 lg:px-8">
                    {/* Left section: Logo and Location */}
                    <div className='flex items-center gap-2 flex-grow min-w-0'>
                        <Link to={'/'} className="flex-shrink-0">
                            <img className='w-20' src="https://logos-world.net/wp-content/uploads/2020/11/Swiggy-Emblem.png" alt="Swiggy" />
                        </Link>
                        <div className='flex items-center gap-2 min-w-0 cursor-pointer' onClick={ToggleVisible}>
                            <p className='font-bold border-b-2 text-[15px] whitespace-nowrap'>Others</p>
                            <p className='hidden sm:block text-[14px] text-gray-600 truncate min-w-0 max-w-[200px] md:max-w-none lg:max-w-[250px]'>{description}</p>
                            <i className="fi fi-ss-angle-small-down pt-1 text-amber-600 text-2xl"></i>
                        </div>
                    </div>

                    {/* Right section: Navigation links */}
                    <div className='flex items-center gap-4 md:gap-8 lg:gap-16 flex-shrink-0'>
                        {
                            content.map((val, index) => (
                                <Link to={`${val.path}`} key={index}>
                                    <div className='flex flex-col items-center sm:flex-row gap-1 relative hover:text-orange-500 transition-colors duration-200'>
                                        {val.image}
                                        <p className='text-sm sm:font-semibold text-gray-700 hidden lg:block'>{val.name}</p>
                                        {val.name === "Cart" && CartData.length > 0 && (
                                            <span className='absolute -top-1 right-[-10px] md:top-0 md:right-[-12px] bg-red-500 text-white text-xs px-1.5 rounded-full'>
                                                {CartData.length}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            ))
                        }
                    </div>
                </div>
            </nav>
            <Outlet/>
        </div>
    )
}

export default Navbar;