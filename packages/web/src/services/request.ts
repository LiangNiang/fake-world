import axios from 'axios';

export type CommonJSONResponse<T> = {
  data: T;
  message: string;
  code: number;
};

const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export default request;
