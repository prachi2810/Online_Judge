import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useData from "./useData";

const useAxiosPrivate = (axios) => {
    const refresh = useRefreshToken();
    const { token } = useData();
    // console.log("axios private",token);
    useEffect(() => {

        const requestIntercept = axios.interceptors.request.use(
            config => {
                if (!config.headers['token']) {
                    config.headers['token'] = token.accessToken;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = axios.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 401 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['token'] = newAccessToken;
                    return axios(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestIntercept);
            axios.interceptors.response.eject(responseIntercept);
        }
    }, [token, refresh,axios])

    return axios;
}

export default useAxiosPrivate;