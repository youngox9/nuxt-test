const axios = require("axios").default;

// const BASE1 = "";

const AUTH_URL = "http://192.168.0.221:8080";
const BASE_URL = "http://192.168.0.161:3000";

//
// http://192.168.0.221:8080
// http://192.168.0.161:3000

// const instance = axios.create({
//   baseURL: AUTH_URL,
//   headers: { Authorization: `Bearer ${token}` },
// });

function getProfile() {
  try {
    //
    const profile = JSON.parse(window.localStorage.getItem("auth")) || {};
    return profile;
  } catch (e) {}
  return {};
}
const instance = (config = {}) => {
  const { auth = false } = config;
  const { accessToken = "" } = getProfile();
  return axios({
    headers: {
      Authorization: `Bearer ${accessToken}`,
      // "Content-Type": "application/x-www-form-urlencoded",
      "Content-Type": "application/json",
    },
    ...config,
    url: (auth ? AUTH_URL : BASE_URL) + config.url,
  });
};

export default instance;
