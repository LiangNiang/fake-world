import { SaveOutlined } from '@ant-design/icons';
import Editor from '@monaco-editor/react';
import { useKeyPress } from 'ahooks';
import { App, Button } from 'antd';
import { isNull } from 'lodash-es';
import { editor } from 'monaco-editor';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';

import { PERSIST_UPDATE_KEY, persistEventEmitter } from '@/state/effects';
import { currentDataSourceState } from '@/state/globalConfig';

import DataSourceManage from './DataSourceManage';

const CodeMenu = () => {
  const [v, setV] = useState('');
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const { t } = useTranslation();
  const { message } = App.useApp();
  const { id: dataSourceKey } = useRecoilValue(currentDataSourceState);

  const getValue = () => {
    const v = localStorage.getItem(dataSourceKey);
    if (isNull(v)) return '';
    return JSON.stringify(JSON.parse(v), null, 2);
  };

  useEffect(() => {
    setV(getValue());
    const listener = () => {
      setTimeout(() => {
        setV(getValue());
      });
    };
    persistEventEmitter.addEventListener(PERSIST_UPDATE_KEY, listener);

    return () => {
      persistEventEmitter.removeEventListener(PERSIST_UPDATE_KEY, listener);
    };
  }, []);

  useKeyPress(
    'ctrl.s',
    (ev) => {
      ev.preventDefault();
      save();
    },
    { exactMatch: true }
  );

  const save = () => {
    try {
      const newStorageData = JSON.parse(v);
      localStorage.setItem(dataSourceKey, JSON.stringify(newStorageData));
      location.reload();
    } catch (err) {
      console.log(err);
      message.error('不合法的原数据');
    }
  };

  return (
    <>
      <DataSourceManage />
      <div className="mb-4 mt-1 flex items-center justify-between">
        <span className="font-bold">{t('menu.code')}</span>
        <div>
          <Button.Group>
            <Button type="primary" icon={<SaveOutlined />} onClick={save}>
              {t('base.save')}
            </Button>
          </Button.Group>
        </div>
      </div>
      <Editor
        className="shadow"
        defaultLanguage="json"
        value={v}
        options={{
          minimap: {
            enabled: false,
          },
          contextmenu: false,
        }}
        onMount={(editor) => {
          editorRef.current = editor;
        }}
        onChange={(v) => setV(v ?? '')}
      />
    </>
  );
};

export default CodeMenu;
