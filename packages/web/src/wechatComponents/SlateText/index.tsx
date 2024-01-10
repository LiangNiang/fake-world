import { useCreation } from 'ahooks';
import { memo } from 'react';
import { createEditor, Descendant } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';

import Element, { TElementOtherProps } from './Element';
import { withInlines } from './utils';

type Props = {
  content: Descendant[];
} & TElementOtherProps;

const SlateText = ({ content, classNames }: Props) => {
  const editor = useCreation(() => withInlines(withReact(createEditor())), []);

  return (
    <Slate editor={editor} initialValue={content} key={JSON.stringify(content)}>
      <Editable readOnly renderElement={(props) => <Element {...props} readOnly classNames={classNames} />} className={classNames?.base} />
    </Slate>
  );
};

export default memo(SlateText);
