import Cookies from "universal-cookie";

const cookies = new Cookies(null, { path: "/" });

export function setCookie(name, value, options = {}) {
  cookies.set(name, value, options);
}

export function getCookie(name) {
  return cookies.get(name);
}

export function removeCookie(name) {
  cookies.remove(name);
}
