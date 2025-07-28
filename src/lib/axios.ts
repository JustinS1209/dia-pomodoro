import Axios from "axios";
import getConfig from "next/config";
import { MsalService } from "@bosch-gs-bda-apps/msal-wrapper";

// const { publicRuntimeConfig } = getConfig();

// export const graphAxios = Axios.create({
//   baseURL: publicRuntimeConfig["API_URL"],
// });

export const graphAxios = Axios.create();

graphAxios.interceptors.request.use(async (config) => {
  console.log("test");
  const token =
    (await MsalService.instance.getGraphApiToken()) as any as string;
  console.log(token);
  // const token = ""; //TODO: Replace with actual token retrieval logic above as soon as MsalService is implemented

  config.headers.authorization = `Bearer ${token}`;
  config.headers.Accept = "application/json";
  return config;
});
