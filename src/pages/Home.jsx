import WideCarousel from "../components/Carousel/WideCarousel";
import CategoryCard from "../components/Cards/CategoryCard";
import { useScrollReveal } from "../utils/useScrollReveal";
import { categories } from "../assets/constants";
import { dine_24, d1 } from "../assets/images";
import GenButton from "../components/Buttons/GenButton";
import DialogBox from "../components/DialogBox";
import { useState } from "react";

const Home = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to manage dialog visibility
  useScrollReveal();

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div>
      <div className="mt-[5rem]">
        <div className="slide-left">
          <WideCarousel />
        </div>
        <div className="max-container w-full mx-auto mt-[2rem]">
          <hr className="my-4 h-[2px] bg-[#e3dddd] border-0" />
        </div>
        <div className="slide-left">
          <h1 className="flex mb-5 text-col xl:flex-row flex-col justify-center items-center font-palanquin lg:text-3xl sm:text-xl lg:leading-[30px] xl:leading-[40px] lg:pt-10 z-10 sm:pt-20 font-bold text-col slow-fade-in title-bold">
            Explore Our Delicious Categories
          </h1>
        </div>
        <div className="center max-container w-4/5 mx-auto mt-[5rem] fade-in-manual opacity-0">
          <CategoryCard categories={categories} className='gap-10' />
        </div>
      </div>
      <div className="max-container w-4/5 mx-auto mt-[2rem]">
        <hr className="my-4 h-[2px] bg-[#e3dddd] border-0" />
      </div>
      <div className="relative w-full h-[30rem] mt-[3rem] slide-left slow-fade-in">
        <img
          src='/anika.png'
          className="w-full h-full "
          alt="Descriptive text"
        />
        <div className="absolute inset-0 flex justify-center items-end mb-[6rem] ml-[25rem]  ">
          <a href="/blogshow" >
          <GenButton
            text="Read Blogs"
            bgColor="bg-black"
            textColor="text-white"
            size="py-3 px-3"
            borderRadius="rounded-lg"
          />
          </a>
        </div>
      </div>
      <DialogBox isOpen={isDialogOpen} closeDialog={closeDialog} />
      <div className="h-32"></div>
    </div>
  );
};

export default Home;
