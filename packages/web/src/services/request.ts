import axios from "axios";

import { ENV_API_BASE_URL } from "@/consts";

export type CommonJSONResponse<T> = {
	data: T;
	message: string;
	code: number;
};

const request = axios.create({
	baseURL: ENV_API_BASE_URL,
});

export default request;
