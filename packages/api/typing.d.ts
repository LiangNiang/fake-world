declare namespace NodeJS {
	interface ProcessEnv {
		PORT: number;
		API_URL: string;
		DATABASE_URL: string;
		OPENAI_baseURL: string;
		OPENAI_apiKey: string;
		OPENAI_model: string;
	}
}
