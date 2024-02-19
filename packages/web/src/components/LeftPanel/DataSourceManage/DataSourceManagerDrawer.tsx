import { Divider, Drawer } from 'antd';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import DataSourceList from './DataSourceList';
import LoadShareDataSource from './LoadShareDataSource';
import NewDataSource from './NewDataSource';

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const DataSourceManagerDrawer = ({ open, setOpen }: Props) => {
  const { t } = useTranslation();

  return (
    <Drawer
      title={t('menu.dataSourceManage.manage')}
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      placement="left"
      width={892}
      destroyOnClose
    >
      <div className="flex flex-col">
        <NewDataSource />
        <Divider />
        <LoadShareDataSource />
        <Divider />
        <DataSourceList />
      </div>
    </Drawer>
  );
};

export default DataSourceManagerDrawer;
