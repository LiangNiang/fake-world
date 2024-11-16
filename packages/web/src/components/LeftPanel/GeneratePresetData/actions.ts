import { MYSELF_ID } from "@/faker/wechat/user";
import { setDialogueListValue } from "@/stateV2/dialogueList";
import { setFeedListValue } from "@/stateV2/moments";
import { getAllProfilesValueSnapshot, setAllProfilesValue } from "@/stateV2/profile";

export function removeAllUsers() {
	const allProfiles = getAllProfilesValueSnapshot();
	allProfiles
		.filter((v) => v.id !== MYSELF_ID)
		.forEach((v) => {
			setAllProfilesValue((pv) => pv.filter((i) => i.id !== v.id));
			setDialogueListValue((pv) => pv.filter((i) => i.friendId !== v.id));
			setFeedListValue((pv) => pv.filter((i) => i.userId !== v.id));
		});
}
