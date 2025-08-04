import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });

// Add response interceptor to suppress 401 errors
axiosWithCredentials.interceptors.response.use(
  (response) => response,
  (error) => {
    // Suppress 401 errors in console since they're expected for new users
    if (error.response?.status === 401) {
      // Don't log 401 errors to console
      return Promise.reject(error);
    }
    // Log other errors normally
    console.error('Axios error:', error);
    return Promise.reject(error);
  }
);

export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
export const USERS_API = `${REMOTE_SERVER}/api/users`;

export const findAllUsers = async () => {
  const response = await axiosWithCredentials.get(USERS_API);
  return response.data;
};

export const findUserById = async (userId: string) => {
  const response = await axiosWithCredentials.get(`${USERS_API}/${userId}`);
  return response.data;
};

export const createUser = async (user: any) => {
  const response = await axiosWithCredentials.post(USERS_API, user);
  return response.data;
};

export const updateUser = async (user: any) => {
  const response = await axiosWithCredentials.put(
    `${USERS_API}/${user._id}`,
    user
  );
  return response.data;
};

export const deleteUser = async (userId: string) => {
  const response = await axiosWithCredentials.delete(`${USERS_API}/${userId}`);
  return response.data;
};

export const findUsersForCourse = async (courseId: string) => {
  // Get all users and filter by course enrollment
  const allUsers = await findAllUsers();
  const enrollments = await getEnrollmentsForCourse(courseId);
  
  // Filter users who are enrolled in the course
  return allUsers.filter((user: any) => 
    enrollments.some((enrollment: any) => enrollment.user === user._id)
  );
};

export const getEnrollmentsForCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/enrollments/current`);
  const allEnrollments = response.data;
  return allEnrollments.filter((enrollment: any) => enrollment.course === courseId);
}; 