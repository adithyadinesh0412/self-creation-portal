import { Injectable } from '@angular/core';
import { lastValueFrom, map,} from 'rxjs';
import {HttpProviderService } from "../http-provider/http-provider.service"
import * as _ from 'lodash';


@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(private httpService:HttpProviderService) { }

  // Getting form from api
  async getForm(formBody: any): Promise<any> {
    const config = {
      url: "scp/v1/form/read",
      payload: formBody,
  };
  let result = await lastValueFrom(
    this.httpService.post(config.url, formBody).pipe(
      map((result: any) => {
        let formData = _.pick(result, ['meta.formsVersion', 'result']);
        // this.addFormToLocal(formBody.type, formData);
        return result.result.data.fields.controls;
      })
    )
  );
  return result;
  }

}
