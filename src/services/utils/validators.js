import AuthApi from "../api/AuthAPI";

// eslint-disable-next-line max-len
const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;

export function isEmailValid(email) {
  return email == "" ? false : reg.test(email);
}

export function isUsernameValid(username) {
  return username == "" ? false : !/@/.test(username);
}

export async function isEmailExist(email) {
  try {
    const { data } = await AuthApi.checkEmail(email);
    return data;
  } catch (e) {
    console.error(
      "[Validators].checkEmail() error:",
      e.response ? e.response.data.message : e.toString()
    );
    return false;
  }
}

export async function isUsernameExist(username) {
  try {
    const { data } = await AuthApi.checkUsername(username);
    return data;
  } catch (e) {
    console.error(
      "[Validators].checkUsernameExist() error:",
      e.response ? e.response.data.message : e.toString()
    );
    return false;
  }
}
