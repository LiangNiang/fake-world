import { DragOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import { ComponentType, useMemo } from 'react';
import { ReactSortable } from 'react-sortablejs';

type Props = {
  value?: string[];
  onChange?: (value: string[]) => void;
  LabelComponent: ComponentType<{ id: string; className?: string }>;
};

const DragSort = ({ value, LabelComponent, onChange }: Props) => {
  const mappedSortableListData = useMemo(() => {
    if (value) {
      return value?.map((v) => ({ id: v }));
    }
    return [];
  }, [value]);

  return (
    <ReactSortable
      list={mappedSortableListData}
      animation={400}
      setList={(v, sortable) => {
        if (sortable) {
          onChange?.(v.map((v) => v.id));
        }
      }}
      className="-mt-2 flex flex-wrap"
    >
      {value?.map((v) => (
        <div key={v} className="mt-2">
          <Tag className="cursor-move select-none" icon={<DragOutlined />}>
            <LabelComponent id={v} className="inline" />
          </Tag>
        </div>
      ))}
    </ReactSortable>
  );
};

export default DragSort;
