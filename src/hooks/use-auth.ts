import { useCurrentUser } from "../config/api/get-current-user";
import { getAccessToken } from "../config/utils";

export const useAuth = () => {
  const accessToken = getAccessToken();

  const {
    data: user,
    isLoading,
    isSuccess,
  } = useCurrentUser({
    enabled: !!accessToken,
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!accessToken && isSuccess,
  };
};