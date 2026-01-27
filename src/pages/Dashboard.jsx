import React from "react";
import Display from "../components/Display";
import Control from "../components/Control";
import LeftBar from "../components/LeftBar";

const Dashboard = () => {
  return (
    <div className="flex">
      <div className=" flex  justify-center items-center h-screen w-[80vw] flex-col gap-10">
        <div className="nav flex h-[6vh] w-[50vw] rounded-2xl bg-gray-500 justify-around items-center ">
          <h1>✅Ros Connection</h1>
          <h1>✅Camera Connection</h1>
        </div>
        <Display />
        <Control />
      </div>
        <LeftBar />
    </div>
  );
};

export default Dashboard;
