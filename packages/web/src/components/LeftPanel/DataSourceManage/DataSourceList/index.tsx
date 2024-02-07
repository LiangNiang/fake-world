import { css, Global } from '@emotion/react';
import { App, Button, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useRef, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { DBManager, getCurrentStorageKey } from '@/dataSource';
import { currentDataSourceState, DATA_SOURCE_TYPE_LABEL, dataSourceListState, IDataSourceItem } from '@/state/globalConfig';

import EditDataSourceModal from '../EditDataSourceModal';
import ShareOperation from './ShareOperation';

const DataSourceList = () => {
  const [dataSourceList, setDataSourceList] = useRecoilState(dataSourceListState);
  const setCurrentDataSource = useSetRecoilState(currentDataSourceState);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { modal } = App.useApp();
  const editIdRef = useRef<IDataSourceItem['id']>(getCurrentStorageKey());
  const TABLE_COLUMNS: ColumnsType<IDataSourceItem> = [
    {
      title: 'ID',
      dataIndex: 'id',
      className: 'whitespace-nowrap',
    },
    {
      title: '名字',
      dataIndex: 'name',
      render: (name: IDataSourceItem['name']) => name ?? '-',
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: (type: IDataSourceItem['type']) => DATA_SOURCE_TYPE_LABEL[type],
    },
    {
      title: '是否使用',
      dataIndex: 'isCurrent',
      render: (isCurrent: IDataSourceItem['isCurrent']) => (isCurrent ? '是' : '否'),
    },
    {
      title: '分享 Key',
      dataIndex: 'shareKey',
      render: (shareKey: IDataSourceItem['shareKey']) => shareKey ?? '无',
    },
    {
      title: '操作',
      dataIndex: 'id',
      render: (id: IDataSourceItem['id'], record) => {
        const isLocal = record.type === 'local';
        return (
          <>
            {!record.isCurrent && (
              <>
                <Button
                  type="link"
                  onClick={() => {
                    modal.confirm({
                      title: '是否切换数据源？',
                      onOk: () => {
                        setCurrentDataSource((prev) => ({ ...prev, isCurrent: false }));
                        setDataSourceList((prev) => prev.map((item) => (item.id === id ? { ...item, isCurrent: true } : item)));
                        location.reload();
                      },
                    });
                  }}
                  className="px-2 py-1"
                >
                  启用
                </Button>
                <Button
                  type="link"
                  danger
                  onClick={() => {
                    modal.confirm({
                      title: '是否删除该数据源？',
                      onOk: () => {
                        setDataSourceList((prev) => prev.filter((item) => item.id !== id));
                        localStorage.removeItem(id);
                        DBManager.removeDBById(id);
                      },
                    });
                  }}
                  className="px-2 py-1"
                >
                  删除
                </Button>
              </>
            )}
            <Button
              type="link"
              className="px-2 py-1"
              onClick={() => {
                editIdRef.current = id;
                setEditModalOpen(true);
              }}
            >
              详情｜编辑
            </Button>
            {isLocal && <ShareOperation record={record} />}
          </>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="text-lg font-semibold">数据源列表</div>
      <Global
        styles={css`
          .isCurrent {
            .ant-table-cell-row-hover {
              background: #bbf7d0 !important;
            }
          }
        `}
      />
      <Table<IDataSourceItem>
        rowClassName={(record) => {
          if (record.isCurrent) {
            return '!bg-green-100 isCurrent';
          }
          return '';
        }}
        dataSource={dataSourceList}
        columns={TABLE_COLUMNS}
        pagination={false}
        className="mt-4"
        rowKey="id"
      />
      <EditDataSourceModal open={editModalOpen} setOpen={setEditModalOpen} dataSourceId={editIdRef.current} />
    </div>
  );
};

export default DataSourceList;
