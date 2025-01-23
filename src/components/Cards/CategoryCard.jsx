import React from "react";
import { useNavigate } from "react-router-dom";
import { useScrollReveal } from "../../utils/useScrollReveal";

const CategoryCard = ({ categories }) => {
  const navigate = useNavigate();
  useScrollReveal();

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {categories.map((item, index) => (
        <div
          key={index}
          className="cursor-pointer group relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg w-[35rem] hover:shadow-lg transition-shadow duration-300" // Adjusted width to 30rem
          onClick={() =>
            navigate(item.link, {
            })
          }
        >
          <div className="relative h-[15rem] m-2.5 overflow-hidden text-white rounded-md"> {/* Adjusted height */}
            <img
              className="transition-transform object-cover duration-500 ease-[cubic-bezier(0.25, 1, 0.5, 1)] transform group-hover:scale-110"
              src={item.image}
              alt={item.name}
            />
          </div>
          <div className="p-4">
            <h6 className="mb-2 text-slate-800 text-xl font-semibold">
              {item.name}
            </h6>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryCard;
