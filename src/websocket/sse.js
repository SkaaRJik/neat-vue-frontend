import { EventSourcePolyfill } from "event-source-polyfill";

import { DEV_API_SERVER, PROD_API_SERVER } from "../../ApiServerSettings";
import store from "@/store";

const API_SERVER =
  process.env.NODE_ENV === "development" ? DEV_API_SERVER : PROD_API_SERVER;

let eventSource = null;

export function connect(authorizationToken) {
  if (eventSource && eventSource) {
    console.log("Server-sent event already connected!");
    return;
  }

  if (window.EventSource) {
    console.log("Event source available");
    eventSource = new EventSourcePolyfill(`${API_SERVER}/sse/connect`, {
      headers: {
        Authorization: authorizationToken
      }
    });

    eventSource.addEventListener("message", function(e) {
      console.log(e.data);
    });

    eventSource.addEventListener("experiment", async ({ data }) => {
      const experiment = await JSON.parse(data);
      await store.dispatch("project/SET_EXPERIMENT_DATA", experiment);
    });

    eventSource.addEventListener(
      "open",
      // eslint-disable-next-line no-unused-vars
      function(e) {
        console.log("Connection was opened.");
      },
      false
    );

    eventSource.addEventListener(
      "error",
      function(e) {
        if (e.readyState == EventSource.CLOSED) {
          console.log("Connection was closed.");
        } else {
          console.log("Connection is expired. Trying to reconnect...");
          const user = JSON.parse(localStorage.getItem("user"));
          if (user) {
            const AUTH_TOKEN = user.tokens.accessToken;
            eventSource = new EventSourcePolyfill(`${API_SERVER}/sse/connect`, {
              headers: {
                Authorization: AUTH_TOKEN
              }
            });
            console.log("Reconnected!");
          }
        }
      },
      false
    );
  } else {
    console.log("No SSE available");
  }
}
