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
      <div className="overflow-y-auto">
        <NodeTree />
      </div>
    </>
  );
};

export default TreesMenu;
