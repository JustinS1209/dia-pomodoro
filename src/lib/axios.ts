import Axios from "axios";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export const graphAxios = Axios.create({
  baseURL: publicRuntimeConfig["API_URL"],
});

graphAxios.interceptors.request.use(async (config) => {
  // const token =
  //   (await MsalService.instance.getGraphApiToken()) as any as string;

  const token = ""; //TODO: Replace with actual token retrieval logic above as soon as MsalService is implemented

  config.headers.authorization = `Bearer ${token}`;
  config.headers.Accept = "application/json";
  return config;
});
