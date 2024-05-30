import { isNil } from "lodash-es";

export const specialValueFormatter = (value: any, defaultValue: any) => {
	if (isNil(value)) {
		return defaultValue;
	}
	return value;
};
