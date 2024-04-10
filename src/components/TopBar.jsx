import { useState, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useCookies } from "react-cookie";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore/lite";

import { FaGoogle } from "react-icons/fa";
import { FaCloudArrowUp } from "react-icons/fa6";

const API_KEY = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY;

function TopBar() {
  const [data, setData] = useState({ test: "test" });
  const firebaseApp = initializeApp({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  });
  const db = getFirestore(firebaseApp);

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7);
  const cookieNames = ["userInfo", "userAuth", "appDataId", "appData"];
  const [cookies, setCookie, removeCookie] = useCookies(cookieNames);

  const scopeUrls = [
    "https://www.googleapis.com/auth/drive.appdata",
    "https://www.googleapis.com/auth/drive.file",
  ];
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

  async function getUserData(id) {
    if (id === undefined || id === null) {
      id = cookies.userInfo.sub;
    }
    const ref = doc(db, "users", id);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      console.log("User data:", snap.data());
      return snap.data();
    } else {
      console.log("User not found!");
    }
  }

  async function setUserData(data) {
    if (cookies.userInfo.sub && cookies.userInfo.sub !== null) {
      const res = await setDoc(doc(db, "users", cookies.userInfo.sub), data);
      console.log("Set user in database", res);
      return res;
    }
  }

  const login = useGoogleLogin({
    onSuccess: (response) => {
      console.log(response);
      setCookie("userAuth", response, {
        expires: expiryDate,
      });
      window.location.reload();
    },
    onError: () => {
      console.log("Login Failed");
      logout();
    },
    onNonOAuthError: (error) => {
      console.error("Non-OAuth error", error);
      logout();
    },
    scope: scopeUrls.join(" "),
  });

  async function fetchUserInfo() {
    if (cookies.userAuth) {
      if (hasAllRequiredScopes(cookies.userAuth.scope)) {
        await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token=" +
            cookies.userAuth.access_token
        )
          .then(async (res) => {
            const json = await res.json();
            setCookie("userInfo", json, { expires: expiryDate });
            return json;
          })
          .then(async (json) => {
            console.log("User info:", json);
            const userDoc = await getUserData(json.sub);
            if (userDoc) {
              console.log("User found in database");
              cookies.appDataId = userDoc.appDataId;
            } else {
              console.log("User not found in database");
              removeCookie("appDataId");
            }
          });
      } else {
        console.error("User has not granted all scopes");
        console.log(cookies.userAuth.scope);
        logout();
      }
    }
  }

  useEffect(() => {
    console.log("useEffect");
    if (cookies.userAuth && cookies.userAuth !== null) {
      fetchUserInfo();
      retrieveAppData();
    }
  }, []);

  const logout = () => {
    console.log("Logging out");
    for (const name of cookieNames) {
      removeCookie(name);
    }
    console.log("Logged out");
  };

  async function uploadAppData(data) {
    const doc = await getUserData();
    if (doc.appDataId && doc.appDataId !== "") {
      console.log("User data:", doc);
      setCookie("appDataId", doc.appDataId, { expires: expiryDate });
    } else if (cookies.userAuth.access_token) {
      const url =
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id&supportsAllDrives=true&key=" +
        API_KEY;

      data.name = "retype_app_data.json";
      data.parents = ["appDataFolder"];
      console.log(data);

      const metadata = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cookies.userAuth.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        media: {
          mimeType: "application/json",
        },
      };

      const response = await fetch(url, metadata);
      const json = await response.json();
      console.log(json);

      setCookie("appDataId", json.id, { expires: expiryDate });
      setUserData({ appDataId: json.id });

      return json;
    }
  }

  async function retrieveAppData() {
    const doc = await getUserData();
    if (doc.appDataId && doc.appDataId !== "") {
      console.log("User data:", doc);
      setCookie("appDataId", doc.appDataId, { expires: expiryDate });
    } else if (cookies.userAuth && cookies.appDataId) {
      const url =
        "https://www.googleapis.com/drive/v3/files/" +
        cookies.appDataId +
        "?" +
        "alt=media&key=" +
        API_KEY;
      const metadata = {
        headers: {
          Authorization: `Bearer ${cookies.userAuth.access_token}`,
          "Content-Type": "application/json",
        },
      };
      const response = await fetch(url, metadata);
      const data = await response.text();
      const json = JSON.parse(data);
      console.log(json);
      setUserData(json);
    }
  }

  return (
    <div className="bg-secondary-800 flex place-content-center py-4">
      <div className="flex justify-between items-center w-11/12">
        <img src="/retype_logo_transparent.png" alt="logo" className="h-20" />

        {cookies.userInfo && cookies.userInfo !== null ? (
          <div className="flex justify-between items-center w-1/2">
            <button
              onClick={() => uploadAppData(data)}
              className="flex gap-2 items-center bg-transparent hover:bg-primary-500 border border-secondary-500 hover:border-transparent text-secondary-500 hover:text-secondary-800 font-bold py-2 px-4 rounded-full"
            >
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
                src={cookies.userInfo.picture}
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
