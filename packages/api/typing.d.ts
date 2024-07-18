declare namespace NodeJS {
	interface ProcessEnv {
		PORT: number;
		OPENAI_baseURL: string;
		OPENAI_apiKey: string;
		OPENAI_model: string;
	}
}
