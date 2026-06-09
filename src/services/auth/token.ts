import axios from "axios";
import { getRefreshToken, setTokens } from "@/utils/storage";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export const getNewTokens = async (): Promise<string> => {
  const refreshToken = getRefreshToken();
  const response = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
  const { accessToken, refreshToken: newRefreshToken } = response.data;
  setTokens(accessToken, newRefreshToken);
  return accessToken;
};