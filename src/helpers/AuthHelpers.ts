import { AccountModel } from "../models/AccountModel";

export const isUserLoggedIn = () => !!window.localStorage.getItem("BIP_39_KEY");

export const getAccountInfo = (): AccountModel =>
  new AccountModel({
    username: window.localStorage.getItem("USER_NAME") ?? "",
    seed: window.localStorage.getItem("BIP_39_KEY") ?? "",
    chain: window.localStorage.getItem("CHAIN") ?? "",
    role: window.localStorage.getItem("ROLE") ?? "",
  });

export const setAccountInfo = (
  username: string,
  seed: string,
  chain: string,
  role: string
) => {
  window.localStorage.setItem("USER_NAME", username);
  window.localStorage.setItem("BIP_39_KEY", seed);
  window.localStorage.setItem("CHAIN", chain);
  window.localStorage.setItem("ROLE", role);
};

export const removeAccountInfo = () => {
  window.localStorage.removeItem("USER_NAME");
  window.localStorage.removeItem("BIP_39_KEY");
  window.localStorage.removeItem("CHAIN");
  window.localStorage.removeItem("ROLE");
};
