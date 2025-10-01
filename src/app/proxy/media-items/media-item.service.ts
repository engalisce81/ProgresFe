import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ResponseApi } from '../response/models';

@Injectable({
  providedIn: 'root',
})
export class MediaItemService {
  apiName = 'Default';

  constructor(private restService: RestService) {}

  uploadImage(file: File, config?: Partial<Rest.Config>) {
    const formData = new FormData();
    formData.append('file', file, file.name); // 'file' مطابق لاسم IFormFile في API

    return this.restService.request<any, ResponseApi<string>>({
      method: 'POST',
      url: '/api/app/media-item/upload-image',
      body: formData,
    }, { apiName: this.apiName, ...config });
  }
}
