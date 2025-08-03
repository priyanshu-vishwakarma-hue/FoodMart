import React from 'react'
import { Description } from './Restaurant'
import { AddCartData } from '../../context/ContextApi'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, deletItem, clearCart} from '../utils/cartSlice'
import { toggleRest } from '../utils/diffRest'
import toast from 'react-hot-toast'

function ExpandingItems({itemCards,flag,restInfo}){
    return(
        <div className='relative '>
            {itemCards?.map((value, index)=>(
                <SingleItem key={index} value={value} flag={flag} restInfo={restInfo}/>
            ))}
        </div>
    )
}

export function SingleItem({value,flag,restInfo}){

    const CartData = useSelector((state) => state.cartSlice.cartItem);
    const getRestInfo = useSelector((state) => state.cartSlice.restInfo);
    const isDiffRest = useSelector((state) => state.diffRest.addCartDiffRest);
    const dispatch = useDispatch();

    function HandleAdd(value){
        const isAdded= CartData.find((item)=> item?.value?.card?.info?.id===value?.card?.info?.id)
        if(!isAdded){
            if(getRestInfo===restInfo.id || getRestInfo.length === 0){
                dispatch(addToCart({value,restInfo}));
                toast.success("Item Added to Cart", {
                    duration: 1000,
                    position: 'top-center',
                    icon: "✅",
                    style: {
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        backgroundColor: "green",
                        color: "white",
                    },
                })
            }
            else{
                dispatch(toggleRest(!isDiffRest));
            }
        }
        else {
            toast.error("Item already exists",{
                duration: 1000,
                position: 'top-center',
                icon: "❎",
                style: {
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    backgroundColor: "red",
                    color: "white",
                },
            })
        }
    }

    function HandleRemove(value){
        let data =CartData.filter(item => item?.value?.card?.info?.id !== value?.card?.info?.id)
        if(data.length==0) dispatch(clearCart())
        else dispatch(deletItem(data));
        toast.success("Item Removed ", {
            duration: 1000,
            position: 'top-center',
            icon: "👍",
            style: {
                fontSize: "1.5rem",
                fontWeight: "bold",
                backgroundColor: "red",
                color: "white",
            },
        })
    }

    const {
        card: {
            info: {
                imageId,
                price,
                finalPrice,
                itemAttribute: { vegClassifier },
                description,
                name,
                ribbon: { text } = {},
                ratings: { aggregatedRating: { rating, ratingCountV2 } = {} } = {},
            },
        },
    } = value;

    return(
        <div>
            <div className='flex flex-col sm:flex-row justify-between py-5 gap-4 sm:gap-10 items-start'>
                <div className='w-full sm:w-2/3'>
                    <div className='flex items-center gap-1'>
                        {vegClassifier=="VEG"? <img className='w-4 h-4 rounded-[6px]' src="https://www.shutterstock.com/image-illustration/pure-veg-icon-logo-symbol-260nw-2190482501.jpg" alt="" />: <img className='w-4 h-4 rounded-[3px]' src="https://cdn.vectorstock.com/i/1000v/00/43/non-vegetarian-sign-veg-logo-symbol-vector-50890043.jpg" alt="" />}
                        {text && <h1 className='text-red-400 text-sm font-bold'>{text}</h1>}
                    </div>
                    <h1 className='text-base font-bold text-gray-600'>{name}</h1>
                    <div className='mb-1'>
                        {finalPrice? <span className='font-bold mb-1'><span className='text-gray-400 line-through'>₹{price/100}</span> ₹{finalPrice/100}</span> : <span className='font-bold '>₹{price/100}</span>}
                    </div>
                    {rating && <div className='flex items-center'>
                        <i className="fi fi-ss-star text-xs text-green-800 pr-1"></i>
                        <h1 className='text-sm'> <span className='text-green-700 font-bold'>{rating}</span> <span className='text-gray-600 font-semibold'>({ratingCountV2})</span></h1>
                    </div>}
                    <Description description={description}/>
                </div>

                <div className='relative w-full sm:w-1/3 max-w-[156px] self-center sm:self-auto'>
                    <img className='w-full h-auto aspect-[16/14] rounded-2xl' src={"https://media-assets.swiggy.com/swiggy/image/upload/"+imageId} alt="" />
                    {flag && <button className='border-gray-400 border bg-white p-2 w-2/3 text-sm md:text-base rounded-xl font-extrabold text-green-600 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 hover:cursor-pointer hover:bg-gray-300' onClick={() => HandleAdd(value)}>ADD</button>}
                    {!flag && <button className='border-gray-400 border bg-white p-2 w-2/3 text-sm md:text-base rounded-xl font-extrabold text-red-600 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 hover:cursor-pointer hover:bg-gray-300' onClick={() => HandleRemove(value)}>REMOVE</button>}
                </div>
            </div>
            <hr className='border-gray-300'/>
        </div>
    )
}

export default ExpandingItems;