import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { DEV_API_SERVER, PROD_API_SERVER } from "../../ApiServerSettings";

let stompClient = null;

const API_SERVER =
  process.env.NODE_ENV === "development" ? DEV_API_SERVER : PROD_API_SERVER;

export function connect(auth_token) {
  const socket = new SockJS(`${API_SERVER}/ws`, null, {
    headers: { Authorization: auth_token }
  });
  stompClient = Stomp.over(socket);
  stompClient.connect({}, frame => {
    console.log("Connected: " + frame);
    stompClient.subscribe("/user/queue/reply", experiment => {
      console.log("[ws]. experiment:", experiment.body);
      // showGreeting(JSON.parse(greeting.body).content);
    });
  });
}

export function disconnect() {
  if (stompClient !== null) {
    stompClient.disconnect();
  }
  console.log("Disconnected");
}
