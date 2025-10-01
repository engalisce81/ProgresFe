import type { RegistercustomDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { LookupAccountDto, LookupDto } from '../look-up/models';
import type { ResponseApi } from '../response/models';

@Injectable({
  providedIn: 'root',
})
export class AccountcustomService {
  apiName = 'Default';
  

  getAccountTypes = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LookupAccountDto>>({
      method: 'GET',
      url: '/api/app/accountcustom/account-types',
    },
    { apiName: this.apiName,...config });
  

  register = (input: RegistercustomDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseApi<LookupDto>>({
      method: 'POST',
      url: '/api/app/accountcustom/register',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
