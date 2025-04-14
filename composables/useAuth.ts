import type { UserState } from "./types/common";

export const useAuth = () => {
	const userState = useState<UserState>("userState", () => null);

	return { userState };
};
