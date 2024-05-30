import request from "./request";

export async function ping() {
	return request.get("/ping");
}
