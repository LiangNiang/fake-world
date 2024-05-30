import ConversationFooter from "./ConversationFooter";
import ConversationHeader from "./ConversationHeader";
import ConversationList from "./ConversationList";
import { ConversationAPIProvider } from "./context";

const Conversation = () => {
	return (
		<ConversationAPIProvider>
			<ConversationHeader />
			<ConversationList />
			<ConversationFooter />
		</ConversationAPIProvider>
	);
};

export default Conversation;
