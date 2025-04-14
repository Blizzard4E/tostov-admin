export type UserState = {
	id: number;
	name: string;
	email: string;
	role: string | null;
	isSuper: boolean | null;
	createdAt: string | null | null;
} | null;

export type Category = {
	id: number;
	name: string;
	createdAt: Date | null;
};
