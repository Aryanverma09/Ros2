import React, { useState } from "react";

const Login = ({ setIsLogin }) => {
  const [Name, setName] = useState("");
  const [Password, setPassword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("Submitted Name:", Name);
    setName("");
    setPassword("");
  };

  return (
    <div className="h-[60vh] w-[30vw] bg-white rounded-2xl shadow-xl border border-gray-200 flex justify-center items-center flex-col gap-8 p-8">
      <div className="flex flex-col justify-center items-center text-center">
        <h1 className="text-3xl font-semibold text-gray-900">Welcome back</h1>
        <p className="text-gray-500 text-sm mt-1">
          Please enter your details to sign in
        </p>
      </div>

      <form onSubmit={submitHandler} className="w-full">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              value={Name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-100 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              type="text"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-100 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              type="password"
            />
          </div>

          <button className="mt-2 bg-black hover:bg-gray-900 transition text-white py-2.5 rounded-lg font-medium">
            Login
          </button>

          <h1
            onClick={() => setIsLogin(false)}
            className="text-sm text-gray-600 text-center cursor-pointer hover:text-black"
          >
            Don’t have an account? Sign in
          </h1>
        </div>
      </form>
    </div>
  );
};

export default Login;
