import axios from 'axios';
import { auth } from '@myapp/utils';
import { API_URL, API_URL_DEV } from '@myapp/constants';

const getAuthHeader = async () => {
  if (auth?.currentUser) {
    const token = await auth.currentUser.getIdToken();
    return `Bearer ${token}`;
  }
  return null;
};

// Shared logic for creating a custom axios instance
const createApi = (baseURL) => {
  const instance = axios.create({ baseURL });

  instance.interceptors.request.use(
    async (config) => {
      try {
        const authHeader = await getAuthHeader();
        if (authHeader) {
          config.headers['Authorization'] = authHeader;
        } else {
          console.warn('No auth header set');
        }
      } catch (error) {
        console.error('Error fetching auth token:', error);
        throw error;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  return instance;
};

// Default API instance (based on NODE_ENV)
const defaultBaseURL =
  process.env.NODE_ENV === 'development' ? API_URL_DEV : API_URL;

export const api = createApi(defaultBaseURL);

// expose getAuthHeader separately
export { getAuthHeader };
