import {
	type IStateProfile,
	getAllProfilesValueSnapshot,
	setAllProfilesValue,
} from "@/stateV2/profile";
import { generateFakeUser } from "./generator";

type options = {
	insertType?: "after" | "before";
};

export function addFakeUser(
	preData: Partial<IStateProfile> = {},
	options: options = {
		insertType: "after",
	},
) {
	const { insertType } = options;
	const profile = generateFakeUser({ ...preData, createdByFaker: true });
	setAllProfilesValue((prev) => (insertType === "after" ? [...prev, profile] : [profile, ...prev]));
}

export function quickAddFakeUser(num = 20) {
	for (let i = 0; i < num; i++) {
		addFakeUser();
	}
}

export function removeFakeUsers() {
	const allProfiles = getAllProfilesValueSnapshot();
	const needRemoveIds: IStateProfile["id"][] = [];
	allProfiles.forEach((profile) => {
		if (profile.createdByFaker) {
			needRemoveIds.push(profile.id);
		}
	});
	setAllProfilesValue((prev) => prev.filter((profile) => !needRemoveIds.includes(profile.id)));
}
