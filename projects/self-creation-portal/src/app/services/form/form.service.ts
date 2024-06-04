import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import {HttpProviderService } from "../http-provider/http-provider.service"
import { FORM_URLS } from '../configs/url.config.json';


@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(private httpService:HttpProviderService) { }

  // Getting form from api
  getForm(formBody: any) {
    const config = {
      url: FORM_URLS.READ_FORM,
      payload: formBody,
  };
  return this.httpService.post(config.url, formBody).pipe(
    map((result: any) => {
      return result.result.data.fields.controls;
    })
  )
  }
}
