import React from "react";
import { useNavigate } from "react-router-dom";
import { useScrollReveal } from "../../utils/useScrollReveal";

const ChooseFoodCard = React.memo(({ categories }) => {
  const navigate = useNavigate();
  useScrollReveal();

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {categories.map((item) => (
        <div
          key={item.foodId}
          className="cursor-pointer group relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg w-[30rem] hover:shadow-lg transition-shadow duration-300"
          onClick={() => navigate(`/detail/${item.foodId}`)}
        >
          <div className="relative h-[20rem] object-cover m-2.5 overflow-hidden text-white rounded-md">
            <img
              className="transition-transform object-cover w-[40rem] h-[20rem] duration-500 ease-[cubic-bezier(0.25, 1, 0.5, 1)] transform group-hover:scale-110"
              src={item.imageUrl || "/placeholder.svg"}
              alt={item.name}
              onError={(e) => {
                e.target.src = "/placeholder-image.jpg";
              }}
            />
          </div>
          <div className="p-4">
            <h6 className="mb-2 text-slate-800 text-xl font-semibold">{item.name}</h6>
          </div>
          <div className="px-4 pb-4 pt-0 mt-2">
            <button
              className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/detail/${item.foodId}`);
              }}
            >
              Explore
            </button>
          </div>
        </div>
      ))}
    </div>
  );
});

export default ChooseFoodCard;
