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
