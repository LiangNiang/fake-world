import { Spin } from 'antd';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';

import NodeTree from '../NodeDetected/NodeTree';
import useMode from '../useMode';

const TreesMenu = () => {
  const { isPreview } = useMode();
  const { t } = useTranslation();

  return (
    <>
      <div className="mb-4 font-bold">
        {t('menu.trees')}
        {isPreview ? t('menu.treesBlock.previewLabel') : t('menu.treesBlock.editLabel')}
      </div>
      <div className="flex-1 overflow-y-auto" id="tree-container">
        <Suspense
          fallback={
            <div className="mt-8 flex justify-center">
              <Spin />
            </div>
          }
        >
          <NodeTree />
        </Suspense>
      </div>
    </>
  );
};

export default TreesMenu;
