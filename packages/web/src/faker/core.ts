import { faker as fakerEN } from "@faker-js/faker/locale/en";
import { faker as fakerZH } from "@faker-js/faker/locale/zh_CN";
import { faker as fakerZH_TW } from "@faker-js/faker/locale/zh_TW";

import { getCurrentLanguage } from "@/i18n";

export const LOCALE_MAP = {
	"zh-CN": fakerZH,
	"en-US": fakerEN,
	"zh-TW": fakerZH_TW,
};

export default function getFakerInstanceByLang() {
	const curLang = getCurrentLanguage();
	return LOCALE_MAP[curLang as keyof typeof LOCALE_MAP] ?? fakerZH;
}

export { fakerEN, fakerZH, fakerZH_TW };
