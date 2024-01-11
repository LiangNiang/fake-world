import { ComponentProps } from 'react';

import List from '@/wechatComponents/List';

export const UniversalList = (props: ComponentProps<typeof List>) => (
  <List
    className="relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:origin-top-left after:scale-y-50 after:border-t after:border-black/10"
    {...props}
  />
);

UniversalList.Item = List.Item;
UniversalList.CanBeDetectedItem = List.CanBeDetectedItem;
