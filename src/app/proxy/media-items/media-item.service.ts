import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { IFormFile } from '../microsoft/asp-net-core/http/models';
import type { ResponseApi } from '../response/models';

@Injectable({
  providedIn: 'root',
})
export class MediaItemService {
  apiName = 'Default';
  

uploadImage(file: File, config?: Partial<Rest.Config>) {
    const formData = new FormData();
    formData.append('file', file, file.name); // 'file' مطابق لاسم IFormFile في API

    return this.restService.request<any, ResponseApi<string>>({
      method: 'POST',
      url: '/api/app/media-item/upload-image',
      body: formData,
    }, { apiName: this.apiName, ...config });
  }

  uploadImages(files: File[], config?: Partial<Rest.Config>) {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file, file.name); // 'files' نفس اسم البارامتر في API
  });

  return this.restService.request<any, PagedResultDto<string>>({
    method: 'POST',
    url: '/api/app/media-item/upload-images',
    body: formData,
  }, { apiName: this.apiName, ...config });
}


  constructor(private restService: RestService) {}
}


