import Axios from "axios";
import { MsalService } from "@bosch-gs-bda-apps/msal-wrapper";

export const graphAxios = Axios.create();

graphAxios.interceptors.request.use(async (config) => {
  const token =
    (await MsalService.instance.getGraphApiToken()) as any as string;

  config.headers.authorization = `Bearer ${token}`;
  config.headers.Accept = "application/json";
  return config;
});
