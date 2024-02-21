import { Image, ImageProps } from 'antd';
import { omit } from 'lodash-es';
import { AllHTMLAttributes, ComponentType, memo } from 'react';

import { ImageDBManager } from '@/dataSource';
import { isMD5 } from '@/utils';

import { useAsyncAssetsCache } from '../useAssetsCache';

const whiteImageUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

interface Props<P = AnyObject> extends AllHTMLAttributes<HTMLElement> {
  useAntdImageComponent?: boolean;
  component?: ComponentType<P> | string;
}

const AntdImage = (props: ImageProps) => {
  if (!props.src) {
    return <></>;
  }
  return <Image {...omit(props, 'useAntdImageComponent')} wrapperClassName={props.className} />;
};

const HashAssets = (props: Props) => {
  const { src, useAntdImageComponent, component: Component = 'img', ...rest } = props;
  useAsyncAssetsCache(isMD5(src));

  const usedSrc = isMD5(src) ? ImageDBManager.IMAGES_CACHE.get(src!) || whiteImageUrl : src || whiteImageUrl;
  if (useAntdImageComponent && Component === 'img') {
    return <AntdImage {...(rest as ImageProps)} src={usedSrc} />;
  }
  return <Component {...rest} src={usedSrc} />;
};

const MemoHashAssets = memo(HashAssets);

const createHashElement = (component: string) => {
  const HashElement = (props: Props) => <MemoHashAssets {...props} component={component} />;
  return memo(HashElement);
};

export const h = {
  img: createHashElement('img'),
};

export default MemoHashAssets;
