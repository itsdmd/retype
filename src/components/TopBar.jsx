import React, { useState, useEffect } from "react";
import { useGoogleLogin, hasGrantedAllScopesGoogle } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

import { FaGoogle } from "react-icons/fa";
import { FaCloudArrowUp } from "react-icons/fa6";

import * as cookie from "../utils/cookie";

function TopBar() {
  const [response, setResponse] = useState(null);
  const [user, setUser] = useState(null);

  const login = useGoogleLogin({
    onSuccess: (response) => {
      console.log(response);
      setResponse(response);
    },
    onError: () => {
      console.log("Login Failed");
      setResponse(null);
    },
    onNonOAuthError: (error) => {
      console.error("Non-OAuth error", error);
      setResponse(null);
    },
    scope:
      "https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file",
  });

  useEffect(() => {
    if (cookie.getCookie("userAuth")) {
      setResponse(cookie.getCookie("userAuth"));
      setUser(cookie.getCookie("userInfo"));
    }
  }, []);

  const requiredScopes = [
    "openid",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/drive.appdata ",
    "https://www.googleapis.com/auth/drive.file",
  ];
  const hasAllRequiredScopes = (scopes) => {
    return requiredScopes.every((scope) => scopes.includes(scope));
  };

  useEffect(() => {
    async function fetchUser() {
      if (response) {
        if (hasAllRequiredScopes(response.scope)) {
          // console.log(response);
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 7);
          cookie.setCookie("userAuth", response, { expires: expiryDate });

          await fetch(
            "https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token=" +
              response.access_token
          ).then(async (res) => {
            const json = await res.json();
            setUser(json);
            cookie.setCookie("userInfo", user, { expires: expiryDate });
          });
        } else {
          console.error("User has not granted all scopes");
          console.log(response);
          logout();
        }
      }
    }

    fetchUser();
  }, [response]);

  const logout = () => {
    console.log("Logging out");
    setResponse(null);
    setUser(null);
    cookie.removeCookie("userInfo");
    cookie.removeCookie("userAuth");
    console.log("Logged out");
  };

  return (
    <div className="bg-secondary-800 flex place-content-center py-4">
      <div className="flex justify-between items-center w-11/12">
        <img src="/retype_logo_transparent.png" alt="logo" className="h-20" />

        {user !== null ? (
          <div className="flex justify-between items-center w-1/2">
            <button className="flex gap-2 items-center bg-transparent hover:bg-primary-500 border border-secondary-500 hover:border-transparent text-secondary-500 hover:text-secondary-800 font-bold py-2 px-4 rounded-full">
              <FaCloudArrowUp />
              Upload
            </button>
            <button
              onClick={logout}
              className="group flex place-items-center gap-x-4"
            >
              <div className="group-hover:text-secondary-500 text-secondary-800">
                Logout
              </div>
              <img
                src={user.picture}
                alt="profile"
                className="h-10 w-10 rounded-full"
              />
            </button>
          </div>
        ) : (
          <div className="group flex place-center gap-x-4">
            <div className="text-center group-hover:text-secondary-500 text-secondary-800 mx-auto">
              Login with
              <br />
              Google
            </div>
            <button
              onClick={login}
              className="group h-10 w-10 p-2 gap-x-4 text-3xl text-secondary-500 group-hover:text-secondary-200"
            >
              <FaGoogle />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopBar;
