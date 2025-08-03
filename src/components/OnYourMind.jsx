import { useRef, useState, useEffect } from "react";

function OnYourMind({ content }) {
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

  useEffect(() => {
    checkScroll();
  }, [content]);

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.querySelector('img').offsetWidth + 16;
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.querySelector('img').offsetWidth + 16;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full flex flex-col p-4 md:p-8 ">
      <div className="flex justify-between items-center ">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold">What's in your mind?</h1>
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
          {content?.map(({ imageId }, index) => {
            let string = "https://media-assets.swiggy.com/swiggy/image/upload/";
            let element = string + imageId;
            return (
              <img
                key={index}
                src={element}
                className="w-1/3 sm:w-1/4 md:w-1/5 lg:w-1/6 flex-shrink-0"
                alt=""
              />
            );
          })}
        </div>
        <hr className="border-b-2 border-gray-200 mt-10" />
      </div>
    </div>
  );
}

export default OnYourMind;