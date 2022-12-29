import { axiosUserInstance as axiosUser } from "../config/http";

const postRequest = async (route, data) => {
  try {
    const result = await axiosUser.post(route, data);
    return result?.data;
  } catch (error) {
    console.error(error.message);
    let errNested = error?.response?.data?.err;
    return {
      success: false,
      errNested,
    };
  }
};

const getRequest = async (route, data) => {
  try {
    const result = await axiosUser.get(route);
    return result?.data;
  } catch (error) {
    console.error(error.message);
    let errNested = error?.response?.data?.err;
    return {
      success: false,
      errNested,
    };
  }
};

export { postRequest, getRequest };
