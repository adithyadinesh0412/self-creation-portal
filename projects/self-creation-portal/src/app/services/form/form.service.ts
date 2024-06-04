import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import {HttpProviderService } from "../http-provider/http-provider.service"
import * as _ from 'lodash';


@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(private httpService:HttpProviderService) { }

  // Getting form from api
  getForm(formBody: any) {
    const config = {
      url: "scp/v1/form/read",
      payload: formBody,
  };
  return this.httpService.post(config.url, formBody).pipe(
    map((result: any) => {
      let formData = _.pick(result, ['meta.formsVersion', 'result.result']);
      return result.result.data.fields.controls;
    })
  )
  }
}
