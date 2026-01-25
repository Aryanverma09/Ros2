import React from "react";
import Display from "../components/Display";
import Control from "../components/Control";

const Dashboard = () => {
  return (
    <div className="bg-blue-600 flex  justify-center items-center h-screen w-[75vw] flex-col gap-10">
      <div className="nav flex h-[6vh] w-[50vw] rounded-2xl bg-gray-500 justify-around items-center ">
        <h1>Ros Connection</h1>
        <h1>Ros Connection</h1>
      </div>
      <Display/>
      <Control/>
    </div>
  );
};

export default Dashboard;
