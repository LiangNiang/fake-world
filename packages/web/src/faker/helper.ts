import getFakerInstanceByLang from "./core";

export function randomTimeString() {
	const faker = getFakerInstanceByLang();
	return `${faker.helpers.rangeToNumber({ min: 0, max: 23 }).toString().padStart(2, "0")}:${faker.helpers.rangeToNumber({ min: 0, max: 59 }).toString().padStart(2, "0")}`;
}
