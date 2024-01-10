import { Descendant } from 'slate';

import { IProfile } from '../profile';

export type TFeedContentType = 'text' | 'textWithImages' | 'video' | 'link';

export interface IFeedComment {
  id: string;
  text: Descendant[];
  replyUserId?: IProfile['id'];
  fromUserId: IProfile['id'];
  sendTimestamp: number;
}

export interface IFeedBase {
  id: string;
  userId: IProfile['id'];
  sendTimestamp: number;
}

export interface IFeed extends IFeedBase {
  content: IFeedContent;
  likeUserIds?: IProfile['id'][];
  comments?: IFeedComment[];
}

interface IFeedContentText {
  type: 'text';
  text: Descendant[];
}

interface IFeedContentTextWithImages {
  type: 'textWithImages';
  text?: Descendant[];
  imagesInfo: string[];
}

interface IFeedContentVideo {
  type: 'video';
  text?: Descendant[];
  videoInfo: string;
}

interface IFeedContentLink {
  type: 'link';
  text?: Descendant[];
  linkInfo: {
    imageInfo: string;
    linkText: string;
  };
}

type IFeedContent = IFeedContentText | IFeedContentTextWithImages | IFeedContentVideo | IFeedContentLink;
