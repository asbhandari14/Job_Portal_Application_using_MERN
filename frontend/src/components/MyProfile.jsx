import React, { useEffect } from "react";
import { useSelector } from "react-redux";




const MyProfile = ({url}) => {

    let { user } = useSelector((state) => state.user);
    
  return (
    <div className="account_components w-full flex flex-col justify-start items-start gap-4">
      <h3 className="text-xl font-semibold">My Profile</h3>
      <div className="w-full h-auto flex flex-col justify-start items-start">
        <label>Full Name</label>
        <input type="text" placeholder="Enter your name here" disabled value={ user && user[0]?.name} onChange={(e) => e.target.value} className="w-full p-2 rounded-md bg-gray-300"/>
      </div>
      <div className="w-full h-auto flex flex-col justify-start items-start">
        <label>Email Address</label>
        <input type="email" placeholder="Enter your email here" disabled value={user && user[0]?.email} onChange={(e) => e.target.value} className="w-full p-2 rounded-md bg-gray-300"/>
      </div>
      {user[0]?.role === "Job Seeker" && (
        <div className="w-full h-auto flex flex-col justify-start items-start my-2">
          <label>My Preferred Job Category</label>
          <div className="w-full flex flex-col justify-start items-start gap-2">
            <input type="text" disabled value={user[0]?.category?.categoryFirst} onChange={(e) => e.target.value} className="w-full p-2 rounded-md bg-gray-300" />
            <input type="text" disabled value={user[0]?.category?.categorySecond} onChange={(e) => e.target.value} className="w-full p-2 rounded-md bg-gray-300"/>
            <input type="text" disabled value={user[0]?.category?.categoryThird} onChange={(e) => e.target.value} className="w-full p-2 rounded-md bg-gray-300" />
          </div>
        </div>
      )}
      <div className="w-full h-auto flex flex-col justify-start items-start">
        <label >Phone Number</label>
        <input type="number" disabled value={user[0]?.phone} onChange={(e) => e.target.value} className="w-full p-2 rounded-md bg-gray-300"
        />
      </div>
      <div className="w-full h-auto flex flex-col justify-start items-start">
        <label>Address</label>
        <input type="text" disabled value={user[0]?.address} onChange={(e) => e.target.value} className="w-full p-2 rounded-md bg-gray-300"
        />
      </div>
      <div className="w-full h-auto flex flex-col justify-start items-start">
        <label>Role</label>
        <input type="text" disabled value={user[0]?.role} onChange={(e) => e.target.value} className="w-full p-2 rounded-md bg-gray-300"
        />
      </div>
      <div className="w-full h-auto flex flex-col justify-start items-start">
        <label>Joined On</label>
        <input type="text"  disabled value={(user[0]?.createdAt)?.substring(0, 10)} onChange={(e) => e.target.value} className="w-full p-2 rounded-md bg-gray-300"
        />
      </div>
    </div>
  );
};

export default MyProfile;
