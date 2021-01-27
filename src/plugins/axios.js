"use strict";

import Vue from "vue";
import axios from "axios";
import store from "@/store/index";
import { DEV_API_SERVER, PROD_API_SERVER } from "../../ApiServerSettings";
import router from "@/router";

const API_SERVER =
  process.env.NODE_ENV === "development" ? DEV_API_SERVER : PROD_API_SERVER;

console.log("[axios].axios API_SERVER:", API_SERVER);

// Full config:  https://github.com/axios/axios#request-config
axios.defaults.baseURL = API_SERVER;

const user = JSON.parse(localStorage.getItem("user"));

if (user) {
  const AUTH_TOKEN = user.tokens.accessToken;
  axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;
}

// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  baseURL: API_SERVER
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let requestQueue = [];

// Add a response interceptor
_axios.interceptors.response.use(
  function(response) {
    // Do something with response data
    return response;
  },
  async function(error) {
    const {
      config,
      response: { status, data }
    } = error;

    if (status === 401 && data.message === "Token is expired") {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await store.dispatch("auth/REFRESH_TOKEN");
          isRefreshing = false;
        } catch (e) {
          console.error("[axios].interceptors.response :", e);
          isRefreshing = false;
          store.dispatch("auth/LOGOUT");
          Vue.$toast.open({
            message: e,
            type: "error"
          });
          router.push({ name: "Home" });
        }
        requestQueue = [];
      }

      const manageRequestQueue = new Promise(resolve => {
        requestQueue.push(() => {
          resolve(axios(config));
        });
      });

      onTokenRefreshed();

      return manageRequestQueue;
    }

    return Promise.reject(error);
  }
);

function onTokenRefreshed() {
  requestQueue.map(callback => callback());
}

Plugin.install = function(Vue) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    }
  });
};

Vue.use(Plugin);

export default Plugin;
