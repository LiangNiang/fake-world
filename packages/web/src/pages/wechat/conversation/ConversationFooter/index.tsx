import { isArray, keys } from 'lodash-es';
import { useState } from 'react';
import { getRecoil, setRecoil } from 'recoil-nexus';

import Add2OutlinedSVG from '@/assets/add2-outlined.svg?react';
import KeyboardOutlinedSVG from '@/assets/keyboard-outlined.svg?react';
import StickerOutlinedSVG from '@/assets/sticker-outlined.svg?react';
import VoiceSVG from '@/assets/voice-outlined.svg?react';
import { activatedNodeState, allNodesState, MetaDataType, nodeInjectMetaState } from '@/state/detectedNode';
import { ModeState, modeState } from '@/state/modeState';

import BottomPopup from './BottomPopup';
import EmojiPanel from './EmojiPanel';
import Input from './Input';

const ConversationFooter = () => {
  const [showEmojiPanel, setShowEmojiPanel] = useState(false);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col border-t bg-[#F6F6F6] p-2">
        <div className="flex w-full items-end space-x-2">
          <VoiceSVG fill="#000" className="h-8 w-8" />
          <Input />
          {showEmojiPanel ? (
            <KeyboardOutlinedSVG fill="#000" className="h-8 w-8 cursor-pointer" onClick={() => setShowEmojiPanel((v) => !v)} />
          ) : (
            <StickerOutlinedSVG fill="#000" className="h-8 w-8 cursor-pointer" onClick={() => setShowEmojiPanel((v) => !v)} />
          )}
          <Add2OutlinedSVG
            fill="#000"
            className="h-8 w-8 cursor-pointer"
            onClick={() => {
              setRecoil(modeState, ModeState.EDIT);
              const allNodes = getRecoil(allNodesState);
              for (const key of keys(allNodes)) {
                const metaData = getRecoil(nodeInjectMetaState(key));
                if (!isArray(metaData) && metaData?.type === MetaDataType.ConversationList) {
                  setRecoil(activatedNodeState, key);
                  break;
                }
              }
            }}
          />
        </div>
      </div>
      <BottomPopup show={showEmojiPanel}>
        <EmojiPanel />
      </BottomPopup>
    </div>
  );
};

export default ConversationFooter;
