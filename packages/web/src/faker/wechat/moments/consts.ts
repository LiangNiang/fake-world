import dayjs from 'dayjs';

import { IFeed, IFeedComment } from '@/state/moments';

import { MYSELF_ID } from '../user';

export const DEFAULT_FEED: Omit<IFeed, 'id'> = {
  userId: MYSELF_ID,
  sendTimestamp: dayjs().valueOf(),
  content: {
    type: 'text',
    text: [{ type: 'paragraph', children: [{ text: '' }] }],
  },
  likeUserIds: [],
  comments: [],
};

export const DEFAULT_FEED_COMMENT: Omit<IFeedComment, 'id'> = {
  fromUserId: MYSELF_ID,
  text: [
    {
      type: 'paragraph',
      children: [{ text: '这是自动生成的评论，进入编辑模式进行修改或删除' }],
    },
  ],
  sendTimestamp: dayjs().valueOf(),
};

export const INIT_FEEDS: IFeed[] = [
  {
    id: '1',
    userId: '1',
    sendTimestamp: dayjs().subtract(13, 'hour').valueOf(),
    content: {
      type: 'text',
      text: [
        {
          type: 'paragraph',
          children: [{ text: '你好' }, { type: 'emoji', emojiSymbol: '0-0', children: [{ text: '' }] }, { text: '' }],
        },
      ],
    },
  },
  {
    id: '2',
    userId: '2',
    sendTimestamp: dayjs().subtract(10, 'minute').valueOf(),
    content: {
      type: 'textWithImages',
      text: [{ type: 'paragraph', children: [{ text: '我是星之卡比' }] }],
      imagesInfo: ['https://cdn-fakeworld.azureedge.net/fakeworld/pnqxld.jpg', 'https://cdn-fakeworld.azureedge.net/fakeworld/pnr4ub.jpg'],
    },
    comments: [
      {
        id: '3',
        fromUserId: '1',
        text: [
          {
            type: 'paragraph',
            children: [{ text: '666' }],
          },
        ],
        sendTimestamp: dayjs().valueOf(),
      },
    ],
  },
  {
    id: '3',
    userId: '4',
    sendTimestamp: dayjs().subtract(30, 'second').valueOf(),
    content: {
      type: 'textWithImages',
      text: [{ type: 'paragraph', children: [{ text: '我是路易吉' }] }],
      imagesInfo: ['https://cdn-fakeworld.azureedge.net/fakeworld/pnr1bd.jpg'],
    },
    likeUserIds: ['1'],
  },
  {
    id: '4',
    userId: '3',
    sendTimestamp: dayjs().valueOf(),
    content: {
      type: 'video',
      text: [{ type: 'paragraph', children: [{ text: '我是马里奥，这是我的新视频，希望大家能喜欢！' }] }],
      videoInfo: 'https://cdn-fakeworld.azureedge.net/fakeworld/pnr1of.jpg',
    },
    likeUserIds: ['2', '3', '1', '4'],
    comments: [
      {
        id: '1',
        fromUserId: '2',
        text: [
          {
            type: 'paragraph',
            children: [
              { text: '这视频做的太6了！！！你能教教我怎么做吗' },
              { type: 'emoji', emojiSymbol: '1-5', children: [{ text: '' }] },
              { text: '' },
            ],
          },
        ],
        sendTimestamp: dayjs().valueOf(),
      },
      {
        id: '2',
        fromUserId: '3',
        replyUserId: '2',
        text: [
          {
            type: 'paragraph',
            children: [{ text: '哈哈哈哈可以！' }],
          },
        ],
        sendTimestamp: dayjs().valueOf(),
      },
      {
        id: '4',
        fromUserId: '1',
        text: [
          {
            type: 'paragraph',
            children: [{ text: '666' }],
          },
        ],
        sendTimestamp: dayjs().valueOf(),
      },
    ],
  },
];
