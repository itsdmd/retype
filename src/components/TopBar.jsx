import React, { useState, useEffect } from "react";
import { useGoogleLogin, hasGrantedAllScopesGoogle } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import { FaGoogle } from "react-icons/fa";

import * as cookie from "../utils/cookie";

function TopBar() {
  const [response, setResponse] = useState(null);

  useEffect(() => {
    if (cookie.getCookie("user")) {
      setResponse(cookie.getCookie("user"));
    }
    console.log(response);
  }, []);

  useEffect(() => {
    if (response) {
      console.log(response);
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);
      cookie.setCookie("user", response, { expires: expiryDate });
    }
  }, [response]);

  const hasGrantedAllScopes = hasGrantedAllScopesGoogle(
    response,
    "drive.appdata",
    "drive.file"
  );

  const logout = () => {
    setResponse(null);
    cookie.removeCookie("user");
  };

  return (
    <div className="bg-secondary-800 flex place-content-center py-4">
      <div className="flex justify-between items-center w-11/12">
        <img src="/retype_logo_transparent.png" alt="logo" className="h-20" />

        {response !== null ? (
          <button
            onClick={logout}
            className="group flex place-items-center gap-x-4"
          >
            <div className="group-hover:text-secondary-500 text-secondary-800">
              Logout
            </div>
            <img
              src={response.picture}
              alt="profile"
              className="h-10 w-10 rounded-full"
            />
          </button>
        ) : (
          <div className="group flex place-items-center gap-x-4">
            <div className="group-hover:text-secondary-500 text-secondary-800">
              Login with Google
            </div>
            <GoogleLogin
              onSuccess={(response) => {
                setResponse(jwtDecode(response.credential));
              }}
              onError={() => {
                setResponse(null);
                console.log("Login Failed");
              }}
              type="icon"
              theme="filled_blue"
              size="large"
              shape="circle"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default TopBar;
