import { IDataSourceItem } from '@/state/globalConfig';

import request, { CommonJSONResponse } from './request';

export async function uploadDataSource(payload: { data: string; name: string; file: Blob | null }) {
  const { data, name, file } = payload;
  const form = new FormData();
  form.append('data', data);
  form.append('name', name);
  if (file) {
    form.append('file', file);
  }
  return request.post<CommonJSONResponse<{ id: string }>>('/api/v1/share', form).then((res) => res.data);
}

export async function deleteDataSource(id: IDataSourceItem['id']) {
  return request.delete(`/api/v1/share/${id}`);
}

interface ShareDataSourceResponse extends IDataSourceItem {
  downloadUrl: string | null;
  data: Record<string, any>;
}

export async function getShareDataSourceInfo(shareId: IDataSourceItem['shareId']) {
  return request.get<ShareDataSourceResponse>(`/api/v1/share/${shareId}`).then((res) => res.data);
}

export async function getRemoteDB(url: string) {
  return request.get<ArrayBuffer>(url, {
    responseType: 'arraybuffer',
  });
}
