import { Divider, Modal } from 'antd';
import { Dispatch, SetStateAction } from 'react';

import CurrentDataSource from './CurrentDataSource';
import DataSourceList from './DataSourceList';
import NewDataSource from './NewDataSource';

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

const DataSourceManagerModal = ({ isModalOpen, setIsModalOpen }: Props) => {
  return (
    <Modal
      title="管理数据源"
      open={isModalOpen}
      onCancel={() => {
        setIsModalOpen(false);
      }}
      okButtonProps={{
        hidden: true,
      }}
      maskClosable
      destroyOnClose
      width={850}
    >
      <div className="flex flex-col">
        <CurrentDataSource />
        <Divider />
        <NewDataSource />
        <Divider />
        <DataSourceList />
      </div>
    </Modal>
  );
};

export default DataSourceManagerModal;
