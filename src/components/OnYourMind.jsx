import { useState } from "react";

function OnYourMind({content}) {

  const [move, setmove] = useState(0);


  return (
    <div className="w-full overflow-hidden flex flex-col mt-5 ">
      <div className="flex justify-between">
        <h1 className=" text-[21px] font-extrabold">What's in your mind?</h1>
        <div className=" flex gap-5 items-center">
          <div
            onClick={() => setmove((prev) => (prev == 0 ? prev : prev + 25))}
            className={
              "rounded-3xl  w-9 h-9 flex justify-center items-center cursor-pointer " +
              (move == 0 ? "bg-gray-200 text-gray-400" : "bg-gray-300")
            }
          >
            <i className="fi fi-rr-arrow-small-left text-2xl mt-2"></i>
          </div>
          <div
            onClick={() => setmove((prev) => (prev == -100 ? prev : prev - 25))}
            className={
              "rounded-3xl  w-9 h-9 flex justify-center items-center cursor-pointer " +
              (move == -100 ? "bg-gray-200 text-gray-400" : "bg-gray-300")
            }
          >
            <i className="fi fi-rr-arrow-small-right text-2xl mt-2"></i>
          </div>
        </div>
      </div>

      <div className=" w-full overflow-x-hidden ">
        <div style={{ translate: `${move}%` }} className=" flex duration-350 ">
          {content?.map(({ imageId }) => {
            let string = "https://media-assets.swiggy.com/swiggy/image/upload/";
            let element = string + imageId;
            return <img src={element} className="w-38" alt="" />;
          })}
        </div>
        <hr className="border-b-2 border-gray-200 mt-10 " />
      </div>
    </div>
  );
}

export default OnYourMind;
