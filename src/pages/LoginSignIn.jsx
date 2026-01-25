import React, { useState } from "react";
import Login from "../components/Login";
import Signin from "../components/Signin";

const LoginSignIn = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div>
      
      {isLogin ? (
        <Login setIsLogin={setIsLogin} />
      ) : (
        <Signin setIsLogin={setIsLogin} />
      )}
    </div>
  );
};

export default LoginSignIn;
