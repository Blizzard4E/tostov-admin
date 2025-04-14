export type APIResponse<Data = undefined> = {
	status: number;
	message: string;
	data?: Data;
};
