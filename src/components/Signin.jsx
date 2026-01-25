import React, { useState } from "react";

const Signin = ({ setIsLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="h-[60vh] w-[30vw] bg-white rounded-2xl shadow-xl border border-gray-200 flex justify-center items-center flex-col gap-8 p-8">
      <div className="flex flex-col justify-center items-center text-center">
        <h1 className="text-3xl font-semibold text-gray-900">
          Create an account
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Sign up to get started
        </p>
      </div>

      <form onSubmit={submitHandler} className="w-full">
        <div className="flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="bg-gray-100 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="bg-gray-100 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="bg-gray-100 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              className="bg-gray-100 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button className="mt-2 bg-black hover:bg-gray-900 transition text-white py-2.5 rounded-lg font-medium">
            Sign up
          </button>

          <h1
            onClick={() => setIsLogin(true)}
            className="text-sm text-gray-600 text-center cursor-pointer hover:text-black"
          >
            Already have an account? Login
          </h1>
        </div>
      </form>
    </div>
  );
};

export default Signin;
