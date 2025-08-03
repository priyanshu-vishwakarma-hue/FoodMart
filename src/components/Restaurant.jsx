import React, { useContext, useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Coordinates } from '../../context/ContextApi';
import ExpandingItems from './ExpandingItems';
import { useSelector, useDispatch } from 'react-redux';
import { toggleRest } from '../utils/diffRest';
import { clearCart } from '../utils/cartSlice';
import toast from 'react-hot-toast';

function Restaurant() {
    const [restInfo, setrestInfo] = useState({});
    const [restOffers, setrestOffers] = useState([]);
    const [menuData, setmenuData] = useState();
    const { coord: { lat, long } } = useContext(Coordinates);
    const isDiffRest = useSelector((state) => state.diffRest.addCartDiffRest);
    const dispatch = useDispatch();

    const [move, setmove] = useState(0);
    let { id } = useParams();
    id = id.split("-").at(-1);
    let RestaurantID = id.substring(4);

    async function fetchcontent() {
        const dummy = await fetch(`https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=${lat}&lng=${long}&restaurantId=${RestaurantID}&catalog_qa=undefined&submitAction=ENTER`);
        const result = await dummy.json();
        setrestInfo(result?.data?.cards[2]?.card?.card?.info);
        setrestOffers(result?.data?.cards[3]?.card?.card?.gridElements?.infoWithStyle?.offers);
        setmenuData(result?.data?.cards[4]?.groupedCard?.cardGroupMap?.REGULAR?.cards);
    }
    useEffect(() => {
        fetchcontent();
    }, []);

    return (
        <div className='w-full p-4 md:p-8 lg:p-16' onClick={() => { isDiffRest && dispatch(toggleRest(false)) }}>
            <div className='w-full max-w-4xl mx-auto'>
                <div className='text-gray-400 text-xs sm:text-sm pt-1'>
                    <span className='hover:text-black'>home </span>/ <span className='hover:text-black'>{restInfo?.city} </span>/ <span className='text-black'>{restInfo?.name}</span>
                </div>
                <h1 className='text-xl sm:text-2xl font-extrabold pt-5 pl-3'>{restInfo?.name}</h1>
                <div className='w-full h-auto md:h-[165px] bg-gradient-to-t from-gray-200 via-gray-100 via-75% to-transparent rounded-b-4xl mt-6 p-4'>
                    <div className='w-full h-full bg-white rounded-2xl border border-gray-300 p-4'>
                        <div className='flex gap-1 items-center font-bold text-sm sm:text-base'>
                            <div className='pt-[5px]'><i className="fi fi-ss-circle-star text-green-600 text-sm sm:text-base"></i></div>
                            <span>{restInfo?.avgRating}</span>
                            <span>({restInfo?.totalRatingsString})</span>
                            <div><i className="fi fi-sr-bullet text-xs text-gray-400"></i></div>
                            <span>{restInfo?.costForTwoMessage}</span>
                        </div>
                        <p className='text-xs sm:text-sm text-red-500 underline font-semibold mt-2'>{restInfo?.cuisines?.join(", ")}</p>
                        <div className='flex gap-2 mt-4'>
                            <div className='w-4 flex flex-col items-center pt-3'>
                                <div className='w-2 h-2 bg-[#C4C4C4] rounded-full'></div>
                                <div className='w-px h-6 bg-[#C4C4C4]'></div>
                                <div className='w-2 h-2 bg-[#C4C4C4] rounded-full'></div>
                            </div>
                            <div className='text-sm flex flex-col'>
                                <div className='pt-1'>
                                    <span className='font-bold'>Outlet</span>
                                    <span className='text-gray-500 pl-3'>{restInfo?.areaName}</span>
                                </div>
                                <h1 className='font-bold pt-2'>{restInfo?.sla?.slaString}</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-4xl mx-auto overflow-hidden flex flex-col mt-8">
                <div className="flex justify-between m-4 mb-1">
                    <h1 className="text-xl sm:text-2xl font-extrabold">Deals for you</h1>
                    <div className="flex gap-4 items-center">
                        <div
                            onClick={() => setmove((prev) => (prev === 0 ? prev : prev + 30))}
                            className={"rounded-full w-9 h-9 flex justify-center items-center cursor-pointer transition-colors duration-200 " + (move === 0 ? "bg-gray-200 text-gray-400" : "bg-gray-300 hover:bg-gray-400")}
                        >
                            <i className="fi fi-rr-arrow-small-left text-2xl mt-1"></i>
                        </div>
                        <div
                            onClick={() => setmove((prev) => (prev <= -90 ? prev : prev - 30))}
                            className={"rounded-full w-9 h-9 flex justify-center items-center cursor-pointer transition-colors duration-200 " + (move <= -90 ? "bg-gray-200 text-gray-400" : "bg-gray-300 hover:bg-gray-400")}
                        >
                            <i className="fi fi-rr-arrow-small-right text-2xl mt-1"></i>
                        </div>
                    </div>
                </div>

                <div className="w-full overflow-hidden">
                    <div style={{ transform: `translateX(${move}%)` }} className="flex transition-transform duration-350 gap-4 p-4">
                        {restOffers?.map(({ info: { header, offerLogo, primaryDescription, description } }, index) => {
                            return (
                                <div key={index} className='min-w-[328px] h-20 p-3 flex items-center gap-2 border border-gray-300 rounded-2xl text-sm flex-shrink-0'>
                                    <div>
                                        <img className='w-12' src={`https://media-assets.swiggy.com/swiggy/image/upload/${offerLogo}`} alt="" />
                                    </div>
                                    <div className='font-bold'>
                                        <p className='font-extrabold text-base'>{header}</p>
                                        <span className='text-gray-400'>{primaryDescription || description}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <h1 className='text-center mt-10 font-bold text-gray-500'>MENU</h1>

            <div className='w-full max-w-4xl mx-auto mt-3 p-4'>
                <div className='w-full bg-gray-100 p-2 flex justify-between items-center rounded-xl hover:cursor-pointer'>
                    <div className='text-gray-500 font-semibold'>Search for dishes</div>
                    <i className="fi fi-rr-search text-base text-gray-500 pr-1"></i>
                </div>
                <hr className='mt-10 border-gray-300' />

                <div className='mt-5 relative'>
                    {menuData?.map(({ card: { card: dummy, card: { title, carousel, itemCards, categories } } }, index) => {
                        if (carousel) {
                            return (<TopPicks key={index} card={dummy} restInfo={restInfo} />);
                        } else if (itemCards) {
                            return (<DirectItems key={index} itemCards={itemCards} title={title} restInfo={restInfo} />);
                        } else if (categories) {
                            return (<DirectCategories key={index} categories={categories} title={title} restInfo={restInfo} />);
                        }
                        return null;
                    })}

                    {
                        isDiffRest &&
                        <div className='w-full max-w-md mx-auto bg-white fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-col gap-2 p-7 shadow-xl rounded-2xl z-50'>
                            <h1 className='font-extrabold text-lg sm:text-xl'>Items already in cart</h1>
                            <p className='text-gray-800 text-sm'>Your cart contains items from another restaurant. Would you like to reset your cart for adding items from this restaurant?</p>
                            <div className='flex justify-center gap-5 mt-4'>
                                <button onClick={() => { dispatch(toggleRest(!isDiffRest)); toast.success("CONTINUE SAME RESTAURANT", { style: { fontWeight: 900 } }) }} className='border-2 border-green-600 w-full p-3 text-green-600 font-extrabold hover:shadow-xl'>NO</button>
                                <button onClick={() => { dispatch(clearCart()); dispatch(toggleRest(!isDiffRest)); toast.success("NOW YOU CAN ADD", { style: { fontWeight: 900 } }) }} className='bg-green-600 w-full font-extrabold text-white hover:shadow-xl'>YES, START AFRESH</button>
                            </div>
                        </div>
                    }

                </div>
            </div>
        </div>
    );
}

function TopPicks({ card: { title, carousel } }) {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(Math.ceil(scrollLeft) + clientWidth < scrollWidth);
        }
    };

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

    return (
        <>
            <div className="w-full overflow-hidden flex flex-col m-auto mt-2">
                <div className="flex justify-between p-4">
                    <h1 className='font-extrabold text-xl'>{title}</h1>
                    <div className="flex gap-4 items-center">
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
                        className="flex gap-4 p-4 overflow-x-scroll styled-scrollbar"
                    >
                        {carousel?.map(({ creativeId, dish: { info: { price } } }, index) => (
                            <div key={index} className='flex-shrink-0 w-full sm:w-[384px]'>
                                <div
                                    className="h-[394px] w-full bg-cover bg-center rounded-3xl"
                                    style={{
                                        backgroundImage: `url(https://media-assets.swiggy.com/swiggy/image/upload/${creativeId})`,
                                    }}
                                >
                                    <div className='flex justify-between items-center p-4 pt-[330px]'>
                                        <h1 className='text-white text-xl font-bold'>₹{price / 100}</h1>
                                        <button className='border border-gray-400 bg-white p-2 w-32 text-lg rounded-xl font-extrabold text-green-600 hover:bg-gray-300'>ADD</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className='h-4 w-full bg-gray-100'></div>
        </>
    );
}

function DirectItems({ itemCards, title, restInfo }) {
    const [Check, setCheck] = useState(true);
    return (
        <div>
            <div className='flex justify-between p-1 pt-3 px-5 cursor-pointer' onClick={() => setCheck(!Check)}>
                <h1 className='font-extrabold text-lg'>{title} ({itemCards.length})</h1>
                <i className={"text-2xl fi fi-ss-angle-small-" + (Check ? "up" : "down")}></i>
            </div>
            {Check && <ExpandingItems itemCards={itemCards} flag={true} restInfo={restInfo} />}
            <div className='h-4 w-full bg-gray-100'></div>
        </div>
    );
}

function DirectCategories({ categories, title, restInfo }) {
    return (
        <div>
            <div className='p-1 pt-3 px-5'>
                <h1 className='font-extrabold text-lg pb-1'>{title}</h1>
                {
                    categories?.map(({ title, itemCards }, i) => (
                        <IndirectItems key={i} title={title} itemCards={itemCards} categories={categories} i={i} restInfo={restInfo} />
                    ))
                }
            </div>
            <div className='h-4 w-full bg-gray-100'></div>
        </div>
    );
}

function IndirectItems({ title, itemCards, categories, i, restInfo }) {
    const [Check, setCheck] = useState(false);
    return (
        <div>
            <div className='flex justify-between pt-3 pb-1 cursor-pointer' onClick={() => setCheck(!Check)}>
                <h1 className='font-semibold text-base'>{title} ({itemCards.length})</h1>
                <i className={"text-2xl fi fi-ss-angle-small-" + (Check ? "up" : "down")}></i>
            </div>
            {i !== categories.length - 1 && <hr className={'border-gray-300 ' + (Check ? 'w-[108px]' : "")} />}
            {Check && <ExpandingItems itemCards={itemCards} flag={true} restInfo={restInfo} />}
        </div>
    );
}

export function Description({ description }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-2 text-sm text-gray-700">
      <p className={expanded ? '' : 'line-clamp-2'}>
        {description}
      </p>
      {description?.length > 150 && (
        <div
          onClick={() => setExpanded(!expanded)}
          className="text-gray-800 font-medium mt-1 cursor-pointer"
        >
          {expanded ? 'Show less' : 'Read more'}
        </div>
      )}
    </div>
  );
}

export default Restaurant;