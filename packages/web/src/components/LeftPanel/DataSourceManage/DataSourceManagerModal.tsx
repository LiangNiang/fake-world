import { Modal } from 'antd';
import { Dispatch, SetStateAction } from 'react';

import CurrentDataSource from './CurrentDataSource';

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
    >
      <div className="flex flex-col">
        <CurrentDataSource />
      </div>
    </Modal>
  );
};

export default DataSourceManagerModal;
