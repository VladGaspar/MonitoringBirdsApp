import axiosInstance from '../utils/axiosSetup';
import {apiPaths} from './apiPaths';


export const userApi = {
    getLeaderboard: () => axiosInstance.get(apiPaths.leaderboard),
    getCompareUsers: params => axiosInstance.get(apiPaths.compareUsers, {
        params,
        paramsSerializer: {
            indexes: null
        }
    }),
    getCompareMe: () => axiosInstance.get(apiPaths.compareMe),
    getReportDownload: () => axiosInstance.get(apiPaths.download),
    getUserInfo: () => axiosInstance.get(apiPaths.userInfo),
};
