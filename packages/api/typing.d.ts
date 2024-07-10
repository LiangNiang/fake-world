declare namespace NodeJS {
	interface ProcessEnv {
		PORT: number;
		API_URL: string;

		OPENAI_baseURL: string;
		OPENAI_apiKey: string;
	}
}
