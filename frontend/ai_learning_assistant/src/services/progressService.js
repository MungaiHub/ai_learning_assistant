import axiosInstance, { toServiceError } from "../utilis/axiosIntance";
import { API_PATHS } from "../utilis/apiPaths";

const getDashboardData = async () => {
    try {
        const response = await axiosInstance.get(API_PATHS.PROGRESS.GET_DASHBOARD);
        return response.data?.data || response.data;
    } catch (error) {
        throw toServiceError(error, "Failed to fetch dashboard data.");
    }
};

const progressService = {
    getDashboardData,
};

export default progressService;
