import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const Home = ({url}) => {
  const {user} = useSelector((state)=>state.user);
  return (
    <>
      <div className="hero w-full min-h-[89vh] flex flex-col justify-center items-center gap-6 max-md:text-center">
        <h1 className="text-red-600 text-6xl font-bold text-center">Find Your Dream Job Today</h1>
        <h4 className="text-xl text-zinc-600 font-semibold mt-3"> Connecting Talent with Opportunities Across the Nation for Every Skill Level </h4>
        <NavLink to="/jobs"><button className={`py-3 px-8 bg-red-600 text-white text-xl tracking-wider rounded-md uppercase my-12 font-semibold ${(user[0]?.role == "Employer")?"hidden" : ""}`}>Go to Jobs</button></NavLink>
      </div>
    </>
  );
};

export default Home;
