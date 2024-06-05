import { Injectable } from '@angular/core';
import {  map} from 'rxjs';
import { HttpProviderService } from "../http-provider/http-provider.service"
import * as _ from 'lodash';
import { FORM_URLS } from '../configs/url.config.json';


@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(private httpService: HttpProviderService) { }

  // Getting form from api
 async getForm(formBody: any) {
    const config = {
      url: FORM_URLS.READ_FORM,
      payload: formBody,
    };
    return await this.httpService.post(config.url, formBody).pipe(
      map((result: any) => {
        return result;
      })
    )
  }

  async getEntities(entityTypes: any) {
    const config = {
      url: "scp/v1/entity-types/read",
      payload: entityTypes.length ? { value: entityTypes } : {}
    };
    return await this.httpService.post(config.url, config.payload).pipe(
      map((result: any) => {
        let data = _.get(result, 'result.entity_types');
        return data;
      })
    )

  }

  getEntityNames(formData: any) {
    const arr1 = formData.controls
      .filter((control: { meta: { entityType: any; }; }) => control?.meta && control.meta.entityType)
      .map((control: { meta: { entityType: any; }; }) => control.meta.entityType);

    const arr2 = formData.controls
      .flatMap((control: { subfields: any; }) => control.subfields ? control.subfields : [])
      .filter((subfield: { meta: { entityType: any; }; }) => subfield?.meta && subfield.meta.entityType)
      .map((subfield: { meta: { entityType: any; }; }) => subfield.meta.entityType);

    return [...arr1, ...arr2];
  }

  async populateEntity(formData: any, entityList: any) {
    _.forEach(formData.controls, (control) => {
      let entity = _.find(entityList, (entityData) => control.name === entityData.value);
      if (entity) {
        control.options = entity.entities.map((entityItem: { label: any; value: any; }) => ({ label: entityItem.label, value: entityItem.value }));
      }
    
      _.forEach(control.subfields, (subfield) => {
        let subfieldEntity = _.find(entityList, (entityData) => subfield.name === entityData.value);
        if (subfieldEntity) {
          subfield.options = subfieldEntity.entities.map((entityItem: { label: any; value: any; }) => ({ label: entityItem.label, value: entityItem.value }));
        }
      });
    });
    return formData;
  }
}
