import { isString } from 'antd/es/button';
import { isFunction } from 'lodash-es';
import { useTranslation } from 'react-i18next';
import { UIMatch, useMatches } from 'react-router-dom';

import { ICommonRouteHandle } from '@/router';

type ReturnTypeOfUseAppInfo = {
  /** 主应用信息 */
  app: {
    name: string;
    id: string;
  };
  /** 当前页面 i18n key */
  label: string;
};

export default function useAppInfo(): ReturnTypeOfUseAppInfo {
  const matches = useMatches();
  const { t } = useTranslation();

  let flag: boolean = false,
    appName: string | undefined,
    appId: string;
  const pages: { handle: ICommonRouteHandle; params: UIMatch['params'] }[] = [];
  matches.forEach((item) => {
    const handle = item.handle as ICommonRouteHandle;
    if (handle) {
      if (isString(handle.label)) {
        appName ??= t(handle.label);
      }
      appId ??= item.pathname;
    }
    if (flag) {
      handle && pages.push({ handle, params: item.params });
    }
    if (appName !== undefined && appId !== undefined) {
      flag = true;
    }
  });

  return {
    app: {
      name: appName!,
      id: appId!,
    },
    label: pages
      .map((v) => {
        const { handle, params } = v;
        if (isFunction(handle.label)) {
          return handle.label(params, t);
        }
        return t(handle.label as string);
      })
      .join(' - '),
  };
}
