import React, { useContext, useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { Coordinates,AddCartData } from '../../context/ContextApi'
import { useDispatch, useSelector } from "react-redux";
import { toggleSearchBar } from '../utils/toggleSlice';



function Navbar() {
    const[text,setText]=useState("");
    const[data,setData]=useState([]);
    const[description,setDescription]=useState("");
    const CartData=useSelector((state)=>state.cartSlice.cartItem)
    const userData = useSelector((state) => state.authSlice.userData);

    async function fetchData() {
        const temp=await fetch(`https://www.swiggy.com/dapi/misc/place-autocomplete?input=${text}`)
        const result=await temp.json();
        setData(result.data)
    }

    async function fetchCoord(id) {
        const temp=await fetch(`https://www.swiggy.com/dapi/misc/address-recommend?place_id=${id}`)
        const result =await temp.json();
        setCoord({
            lat:result?.data[0]?.geometry?.location?.lat , 
            long:result?.data[0]?.geometry?.location?.lng
        })
        setDescription(result?.data[0]?.formatted_address)
        ToggleVisible()
    }
    useEffect(()=>{
        fetchData()
    },[text])

    const visible=useSelector((state)=>state.toggleSlice.searchBarToggle);
    const dispatch=useDispatch();
    const {setCoord} =useContext(Coordinates)

    function ToggleVisible(){
        dispatch(toggleSearchBar())
        setText("")
    }

    const content=[
        {
            image: <i className="fi fi-rr-search pt-1"></i>,
            name: "Search",
            path: "search"
        },
        {
            image: <i className="fi fi-rs-badge-percent pt-1"></i>,
            name: "Offers",
            path: "offers"
        },
        {
            image: (userData? <img src={userData.photo} className='w-[25px] rounded-2xl' alt=""/> : <i className="fi fi-rs-user pt-1"></i>),
            name: (userData? userData.name : "Sign In"),
            path: "SignInPage"
        },
        {
            image: <i className="fi fi-rr-dolly-flatbed pt-1"></i>,
            name: "Cart",
            path: "Cart"
        }
    ]

  return (
    <div className='relative '>

        {
            // visible &&
            <div className='w-full'>
                <div className={'w-full h-screen bg-black/70 absolute z-20 '+(visible? "visible":"invisible")} onClick={ToggleVisible}> </div>
                <div className={'w-[40%] min-h-screen flex flex-col items-end bg-white z-30 absolute duration-500 '+ (visible? "left-0":"left-[-100%]") }>
                    <div className='pt-8 pr-[55px] mb-[50px]'>
                        <i className="fi fi-bs-cross text-[14px] mb-[28px] block hover:cursor-pointer" onClick={ToggleVisible}></i>
                        <input type="text" className='border-1 border-gray-300 p-3 pl-5 w-[360px] focus:outline-none focus:shadow-[0_0_10px_rgba(0,0,0,0.2)] font-semibold' 
                            onChange={(e)=>setText(e.target.value)}
                            value={text}
                        />
                    </div>
                    {
                        data?.map((val)=>(
                            <div className='flex justify-end mr-[55px]'>
                                <i className="fi fi-bs-marker mt-0.5 pr-3"></i>
                                <Link to={"/"}>
                                    <div className='w-[310px] hover:text-red-400' onClick={()=>fetchCoord(val.place_id)}>
                                        <h1 className='font-semibold '>{val?.structured_formatting?.main_text}</h1>
                                        <h2 className='text-gray-500 text-[13px]'>{val?.structured_formatting?.secondary_text}</h2>
                                        <hr className=' border-dashed border-gray-400 my-4'/>
                                    </div>
                                </Link>
                            </div>
                        ))
                    }
                </div>
            </div>
            
        }

        <div className='flex justify-between items-center w-full h-20 shadow-md  bg-white sticky z-10 top-0 '>
            <div className='flex items-center gap-2 w-[40%] pl-[17%]'>
                <Link to={'/'}>
                    <img className='w-23' src="https://logos-world.net/wp-content/uploads/2020/11/Swiggy-Emblem.png" alt="" />
                </Link>
                <div className='flex items-center gap-2 ' onClick={ToggleVisible} >
                    <p className='font-bold border-b-2 text-[15px]'>Others</p>
                    <p className='text-[14px] text-gray-600 truncate max-w-[230px]'>{description} </p>
                    <i className="fi fi-ss-angle-small-down pt-1 text-amber-600 text-2xl"></i>
                </div>
            </div>

            <div className='flex items-center gap-15 w-[60%] '>
                {
                    content.map((val)=>(
                        <Link to={`${val.path}`}>
                            <div className='flex items-center gap-2 '>
                                {val.image}
                                <p className='font-semibold text-gray-700'>{val.name}</p>
                                {val.name == "Cart"? <p className='text-red-900 font-bold mb-3 bg-gray-300 px-2 rounded-2xl'>{CartData.length}</p>: "" }
                            </div> 
                        </Link>
                    )) 
                }
                
            </div>
            
        </div>
        <Outlet/>
    </div>
    
  )
}

export default Navbar