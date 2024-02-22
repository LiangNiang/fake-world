import { memo } from 'react';

import { MetaDataEditor } from '../MetaDataEditor';

const RightPanel = () => {
  return (
    <div className="flex h-screen flex-col max-lg:hidden">
      <div className="flex-1 overflow-auto border-y border-dashed border-orange-400 p-4">
        <div>
          <MetaDataEditor />
        </div>
      </div>
    </div>
  );
};

export default memo(RightPanel);
