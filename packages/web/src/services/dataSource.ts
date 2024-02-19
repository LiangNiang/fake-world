import { IDataSourceItem } from '@/state/globalConfig';

import request, { CommonJSONResponse } from './request';

export async function uploadDataSource(payload: { data: string; file: Blob | null }) {
  const { data, file } = payload;
  const form = new FormData();
  form.append('data', data);
  if (file) {
    form.append('file', file);
  }
  return request.post<CommonJSONResponse<{ shareKey: string; shareId: string }>>('/api/v1/share', form).then((res) => res.data);
}

export async function deleteDataSource(shareId: IDataSourceItem['shareId']) {
  return request.delete(`/api/v1/share/${shareId}`);
}

interface ShareDataSourceResponse {
  downloadUrl: string | null;
  data: Record<string, any>;
  shareKey: string;
}

export async function getShareDataSourceInfo(shareKey: IDataSourceItem['shareKey']) {
  return request.get<CommonJSONResponse<ShareDataSourceResponse>>(`/api/v1/share/${shareKey}`).then((res) => res.data);
}

export async function getRemoteDB(url: string) {
  return request.get<ArrayBuffer>(url, {
    responseType: 'arraybuffer',
  });
}
