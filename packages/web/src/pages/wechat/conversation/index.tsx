import { ConversationAPIProvider } from './context';
import ConversationFooter from './ConversationFooter';
import ConversationHeader from './ConversationHeader';
import ConversationList from './ConversationList';

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
