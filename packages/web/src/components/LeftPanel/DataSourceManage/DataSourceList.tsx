import { App, Button, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { exportDB } from 'dexie-export-import';
import { saveAs } from 'file-saver';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { DBManager } from '@/dataSource';
import { currentDataSourceState, DATA_SOURCE_TYPE_LABEL, dataSourceListState, IDataSourceItem } from '@/state/globalConfig';

const DataSourceList = () => {
  const [dataSourceList, setDataSourceList] = useRecoilState(dataSourceListState);
  const setCurrentDataSource = useSetRecoilState(currentDataSourceState);
  const { modal, message } = App.useApp();

  const TABLE_COLUMNS: ColumnsType<IDataSourceItem> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 200,
    },
    {
      title: '名字',
      dataIndex: 'name',
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
      title: '操作',
      dataIndex: 'id',
      render: (id: IDataSourceItem['id'], record) => (
        <>
          {!record.isCurrent && (
            <>
              <Button
                type="link"
                onClick={() => {
                  setCurrentDataSource((prev) => ({ ...prev, isCurrent: false }));
                  setDataSourceList((prev) => prev.map((item) => (item.id === id ? { ...item, isCurrent: true } : item)));
                  location.reload();
                }}
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
                    },
                  });
                }}
              >
                删除
              </Button>
            </>
          )}
          <Button
            type="link"
            onClick={async () => {
              const db = DBManager.getInstace().getDBInstanceByKey(id);
              const imagesCount = await db.images.count();
              const isEmptyDB = imagesCount === 0;
              if (isEmptyDB) {
                message.warning('数据库为空，无需导出');
              } else {
                const exportedDB = await exportDB(db);
                if (exportedDB !== null) {
                  saveAs(exportedDB, `${id}.db`);
                  message.success('数据库已导出');
                }
              }
            }}
          >
            导出数据库
          </Button>
          <Button type="link">分享</Button>
        </>
      ),
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="text-lg font-semibold">数据源列表</div>
      <Table<IDataSourceItem>
        rowClassName={(record) => {
          if (record.isCurrent) {
            return '!bg-green-100';
          }
          return '';
        }}
        dataSource={dataSourceList}
        columns={TABLE_COLUMNS}
        pagination={false}
        className="mt-4"
        rowKey="id"
      />
    </div>
  );
};

export default DataSourceList;
