import axios from "axios";
const API = axios.create({
  baseURL: "http://localhost:5500",
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
    Accept: "application/json",
  },
});

// List of all the endpoints
export const sendOtp = (data) => API.post("/api/send-otp", data);
export const verifyOtp = (data) => API.post("/api/verify-otp", data);
export const activate = (data) => API.post("/api/activate", data);
export const logout = () => API.post("/api/logout");
//post mean create a room
export const createRoom = (data) => API.post("api/rooms", data);
export const getAllRooms = (page) => API.get(`/api/rooms?page=${page}`);
export const getRoomDetails = (roomId) => API.get(`/api/rooms/${roomId}`);
export const getAllUsers = (page) => API.get(`/api/peoples?page=${page}`);
export const getSingleUser = (userId) => API.get(`/api/user/${userId}`);
export const followUser = (userId) => API.put(`/api/user/${userId}/followUser`);
export const createClub = (clubDetails) =>
  API.post(`/api/user/${clubDetails.userId}/createClub`, clubDetails);
export const updateClub = (clubDetails) =>
  API.put(`/api/club/${clubDetails.clubId}/updateClub`, clubDetails);
export const getAllClubs = (page) => API.get(`/api/clubs?page=${page}`);
export const getSingleClub = (clubId) => API.get(`/api/club/${clubId}`);
export const joinClub = (userId) => API.put(`/api/club/${userId}/joinClub`);

export const createRoomInClub = (clubRoomData) =>
  API.post(`api/club/${clubRoomData.clubId}/createRoom`, clubRoomData);

export const getAllFollowers = (userId) =>
  API.get(`/api/user/${userId}/getAllFollowers`);
export const getAllFollowing = (userId) =>
  API.get(`/api/user/${userId}/getAllFollowing`);

//Interceptors
API.interceptors.response.use(
  (config) => {
    return config; //we dont have to do anything with config
  },
  async (error) => {
    const originalRequest = error.config;
    //if the status code is 401 means it token expired so refresh the token
    if (
      error.response &&
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._isRetry
    ) {
      //for the first time if then isRetry = undefined so we can enter but
      //we set it to true so next time it will not enter in it.
      originalRequest._isRetry = true;
      try {
        //call with axios not with API axios instance
        //bcz next time new instance will created and you cannot get the old one's data and methods
        await axios.get(`http://localhost:5500/api/refresh`, {
          withCredentials: true, //for sending the cookies
        });

        return API.request(originalRequest);
      } catch (error) {
        console.log(error.message);
      }
    }
    throw error;
  }
);

export default API;
