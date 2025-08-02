import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Coordinates } from '../../context/ContextApi';
import ExpandingItems from './ExpandingItems';
import { useSelector,useDispatch } from 'react-redux';
import { toggleRest } from '../utils/diffRest';
import { clearCart } from '../utils/cartSlice';
import toast from 'react-hot-toast';

function Restaurant() {
    const[restInfo,setrestInfo]=useState({});
    const[restOffers,setrestOffers]=useState([]);
    const[menuData,setmenuData]=useState();
    const {coord:{lat,long}}=useContext(Coordinates)
    const isDiffRest=useSelector((state)=>state.diffRest.addCartDiffRest)
    const dispatch=useDispatch();

    const [move, setmove] = useState(0);
    let {id} = useParams();
    id =id.split("-").at(-1);
    let RestaurantID=id.substring(4);


    async function fetchcontent() {
        const dummy=await fetch(`https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=${lat}&lng=${long}&restaurantId=${RestaurantID}&catalog_qa=undefined&submitAction=ENTER`);
        const result=await dummy.json();
        setrestInfo(result?.data?.cards[2]?.card?.card?.info);
        setrestOffers(result?.data?.cards[3]?.card?.card?.gridElements?.infoWithStyle?.offers);
        setmenuData(result?.data?.cards[4]?.groupedCard?.cardGroupMap?.REGULAR?.cards)
    }
    useEffect(()=>{
        fetchcontent();
    },[])

    return (
        <div className='w-full'  onClick={()=>{ isDiffRest && dispatch(toggleRest(false))}}>
            <div className='w-[800px]  m-auto'>
                <div className='text-gray-400 text-[12px] pt-1'><span className='hover:text-black'>home </span>/ <span className='hover:text-black'>{restInfo?.city} </span>/ <span className='text-black'>{restInfo?.name}</span></div>
                <h1 className=' text-[28px] font-extrabold pt-5 pl-3'>{restInfo?.name}</h1>
                <div className='w-full h-[165px] bg-gradient-to-t from-gray-200 via-gray-100 via-75% to-transparent rounded-b-4xl mt-6 p-[18px] pt-0'>
                    <div className='w-full h-full bg-white rounded-2xl border-1 border-gray-300 p-4'>
                        <div className='flex gap-1 items-center font-bold'>
                            <div className='pt-[5px]'><i className="fi fi-ss-circle-star text-green-600 text-[18px] pt-1"></i></div>
                            <span>{restInfo?.avgRating}</span>
                            <span>({restInfo?.totalRatingsString})</span>
                            <div><i className="fi fi-sr-bullet text-[10px] text-gray-400"></i></div>
                            <span>{restInfo?.costForTwoMessage}</span>
                        </div>
                        <p className='text-[15px] text-red-500 underline font-semibold '>{restInfo?.cuisines?.join(", ")}</p>
                        <div className='flex gap-2 '>
                            <div className='w-[10px] flex flex-col items-center pt-3'>
                                <div className='w-[7px] h-[7px] bg-[#C4C4C4] rounded-full '></div>
                                <div className='w-[1px] h-[25px] bg-[#C4C4C4] '></div>
                                <div className='w-[7px] h-[7px] bg-[#C4C4C4] rounded-full '></div>
                            </div>
                            <div className='text-[14px]'>
                                <div className='pt-[5px]'>
                                    <span className='font-bold'>Outlet</span>
                                    <span className='text-gray-500 pl-3'>{restInfo?.areaName}</span>
                                </div>
                                <h1 className='font-bold pt-[9px]'>{restInfo?.sla?.slaString}</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="w-[800px] overflow-hidden flex flex-col m-auto mt-2 ">
                <div className="flex justify-between m-4 mb-1">
                    <h1 className=" text-[21px] font-extrabold">Deals for you</h1>
                    <div className=" flex gap-4 items-center">
                        <div
                            onClick={() => setmove((prev) => (prev == 0 ? prev : prev + 30))}
                            className={
                            "rounded-3xl  w-9 h-9 flex justify-center items-center cursor-pointer " +
                            (move == 0 ? "bg-gray-200 text-gray-400" : "bg-gray-300")
                            }
                        >
                            <i className="fi fi-rr-arrow-small-left text-2xl mt-2"></i>
                        </div>
                        <div
                            onClick={() => setmove((prev) => (prev == -90 ? prev : prev - 30))}
                            className={
                            "rounded-3xl  w-9 h-9 flex justify-center items-center cursor-pointer " +
                            (move == -90 ? "bg-gray-200 text-gray-400" : "bg-gray-300")
                            }
                        >
                            <i className="fi fi-rr-arrow-small-right text-2xl mt-2"></i>
                        </div>
                    </div>
                </div>

                <div className=" w-[770px]  overflow-x-hidden m-auto ">
                    <div style={{ translate: `${move}%` }} className=" flex duration-350 gap-2">
                        {restOffers?.map(({ info:{header,offerLogo,description,primaryDescription}  }) => {
                            return(
                                <div className='min-w-[328px] h-[76px] p-[12px] flex items-center gap-2 border-1 border-gray-300 rounded-2xl text-[14px]'>
                                    <div>
                                        <img className='w-[48px]' src={`https://media-assets.swiggy.com/swiggy/image/upload/${offerLogo}`} alt="" />
                                    </div>
                                    <div className='font-bold'>
                                        <p className='font-extrabold text-[16px]'>{header}</p>
                                        <span className='text-gray-400'>{primaryDescription || description}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>


            <h1 className='text-center mt-10 font-bold text-gray-500'>MENU</h1>

            <div className='w-[800px] m-auto mt-3'>
                <div className='w-full bg-gray-100 p-2 flex justify-end gap-[303px] items-center rounded-xl hover:cursor-pointer'>
                    <div className='text-gray-500 font-semibold'>Search for dishes</div>
                    <i className="fi fi-rr-search mt-0.5 text-[18px] text-gray-500 pr-1"></i>
                </div>
                <hr className='mt-10 border-gray-300'/>

                <div className='mt-5 relative'>
                    {
                        menuData?.map(({card:{card:dummy,card:{title,carousel,itemCards,categories}}})=>{
                            if(carousel){
                                return(
                                    <TopPicks card={dummy} restInfo={restInfo}/>
                                )
                            }
                            else if(itemCards){
                                return(     
                                    <DirectItems itemCards={itemCards} title={title} restInfo={restInfo} />                                      
                                )
                            }
                            else if(categories){
                                return(
                                    <DirectCategories categories={categories} title={title} restInfo={restInfo} />
                                )
                            }
                        })
                    }

                    {
                        isDiffRest &&
                        <div className='w-[520px] h-[200px] bg-white fixed bottom-10 left-[35%] flex flex-col gap-2 p-7' style={{ boxShadow: '0 0 30px rgba(0,0,0,0.4)' }}>
                            <h1 className='font-extrabold text-[20px]'>Items already in cart</h1>
                            <p className='text-gray-800 text-[15px]'>Your cart contains items from other restaurant. Would you like to reset your cart for adding items from this restaurant?</p>
                            <div className='flex justify-center gap-5'>
                                <button onClick={()=>{dispatch(toggleRest(!isDiffRest)); toast.success("CONTINUE SAME RESTAURANT",{style:{fontWeight:900}})}} className='border-2 border-green-600 w-[47%] p-3 text-green-600 font-extrabold hover:shadow-xl'>NO</button>
                                <button onClick={()=>{dispatch(clearCart()); dispatch(toggleRest(!isDiffRest)); toast.success("NOW YOU CAN ADD",{style:{fontWeight:900}})} } className='bg-green-600 w-[47%] font-extrabold text-white hover:shadow-xl'>YES, START AFRESH</button>
                            </div>
                        </div>
                    }

                </div>
            </div>
        </div>
    )
}



function TopPicks({card:{title,carousel,restInfo}}){
    const[TopPicsMove,setTopPicsMove] =useState(0)
    return(
        <>
            <div className="w-[800px] overflow-hidden flex flex-col m-auto mt-2 ">
                <div className="flex justify-between m-4 mb-1">
                    <h1 className='font-extrabold p-3 text-[18px]'>{title}</h1>
                    <div className=" flex gap-4 items-center">
                        <div
                            onClick={() => setTopPicsMove((prev) => (prev == 0 ? prev : prev + 40))}
                            className={
                            "rounded-3xl  w-9 h-9 flex justify-center items-center cursor-pointer " +
                            (TopPicsMove == 0 ? "bg-gray-200 text-gray-400" : "bg-gray-300")
                            }
                        >
                            <i className="fi fi-rr-arrow-small-left text-2xl mt-2"></i>
                        </div>
                        <div
                            onClick={() => setTopPicsMove((prev) => (prev == -240 ? prev : prev - 40))}
                            className={
                            "rounded-3xl  w-9 h-9 flex justify-center items-center cursor-pointer " +
                            (TopPicsMove == -240 ? "bg-gray-200 text-gray-400" : "bg-gray-300")
                            }
                        >
                            <i className="fi fi-rr-arrow-small-right text-2xl mt-2"></i>
                        </div>
                    </div>
                </div>

                <div className=" w-full  overflow-x-hidden m-auto ">
                    <div style={{ translate: `${TopPicsMove}%` }} className=" flex duration-350 gap-2">
                        <div className='flex gap-4'>
                            {carousel?.map(({creativeId,dish:{info:{price}}})=>(
                                <div className=' '>
                                    <div
                                        className="h-[394px] w-[384px] bg-cover bg-center rounded-3xl "
                                        style={{
                                            backgroundImage: `url(https://media-assets.swiggy.com/swiggy/image/upload/${creativeId})`,
                                            // backgroundBlendMode: 'overlay',
                                        }}
                                    >
                                        <div className='flex justify-between items-center p-4 pt-[330px]'>
                                            <h1 className='text-white text-xl font-bold'>₹{price/100}</h1>
                                            <button className=' border-gray-400 border-1 bg-white p-[6px] w-[120px] text-[18px] rounded-xl font-extrabold text-green-600 '>ADD</button>
                                        </div>
                                        
                                    </div>
                            
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className='h-4 w-full bg-gray-100'></div>
        </>
    )
}



function DirectItems({itemCards,title,restInfo}){

    const[Check,setCheck]=useState(true)

    return(
        <div>
            <div className='flex justify-between p-1 pt-3 px-5' onClick={()=> setCheck(!Check)}>
                <h1 className='font-extrabold text-[18px]'>{title} ({itemCards.length})</h1>
                <i className={"text-2xl fi fi-ss-angle-small-"+ (Check===true? "up":"down")} ></i>
            </div>
            { Check && <ExpandingItems itemCards={itemCards} flag={true} restInfo={restInfo}/> }
            <div className='h-4 w-full bg-gray-100'></div>
        </div>
    )
}



function DirectCategories({categories,title,restInfo}){
    return(
        <div>
            <div className='p-1 pt-3 px-5'>
                <h1 className='font-extrabold text-[18px] pb-1'>{title}</h1>
                {
                    categories?.map(({title,itemCards},i)=>{
                        return(
                            <IndirectItems title={title} itemCards={itemCards} categories={categories} i={i} restInfo={restInfo}/>
                        )
                    })
                }
            </div>
            <div className='h-4 w-full bg-gray-100'></div>
        </div>
    )
}


function IndirectItems({title,itemCards,categories,i,restInfo}){

    const[Check,setCheck]=useState(false)

    return(
        <div>
            <div className='flex justify-between  pt-3 pb-1' onClick={()=> setCheck(!Check)}>
                <h1 className='font-semibold text-[16px]'>{title} ({itemCards.length})</h1>
                <i className={"text-2xl fi fi-ss-angle-small-"+ (Check===true? "up":"down")} ></i>
            </div>
            {i!=categories.length-1? <hr className={'border-gray-300 '+ (Check==true? 'w-[108px]': "")}/>: ""}
            { Check && <ExpandingItems itemCards={itemCards} flag={true} restInfo={restInfo}/> }
        </div>
    )
}



export function Description({ description }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-2 text-[16px] text-gray-700">
      <p className={expanded ? '' : 'line-clamp-2'}>
        {description}
      </p>
      {description?.length > 150 && (
        <div
          onClick={() => setExpanded(!expanded)}
          className="text-gray-800 font-medium mt-1"
        >
          {expanded ? 'Show less' : 'Read more'}
        </div>
      )}
    </div>
  );
}



export default Restaurant