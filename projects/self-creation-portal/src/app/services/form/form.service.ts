import { Injectable } from '@angular/core';
import {  Observable, map} from 'rxjs';
import { HttpProviderService } from "../http-provider/http-provider.service"
import { FORM_URLS, RESOURCE_URLS } from '../configs/url.config.json';
import { PROJECT_DETAILS } from '../../constants/formConstant';
import { HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(private httpService: HttpProviderService) { }

  // Getting form from api
  getForm(formBody: any) {
    const config = {
      url: FORM_URLS.READ_FORM,
      payload: formBody,
    };
    return this.httpService.post(config.url, config.payload).pipe(
      map((result: any) => {
        return result;
      })
    )
  }

  getEntities(entityTypes: any) {
    const config = {
      url: FORM_URLS.READ_ENTITY_TYPE,
      payload: entityTypes.length ? { value: entityTypes } : {}
    };
    return this.httpService.post(config.url, config.payload).pipe(
      map((result: any) => {
        let data = result?.result?.entity_types || [];
        return data;
      })
    );
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
  
  populateEntity(formData: any, entityList: any) {
    formData.controls.forEach((control: { name: any; options: any; subfields: any; }) => {
      let entity = entityList.find((entityData: { value: any; }) => control.name === entityData.value);
      if (entity) {
        control.options = entity.entities.map((entityItem: { label: any; value: any; }) => ({ label: entityItem.label, value: entityItem.value }));
      }
      if (control.subfields) {
        control.subfields.forEach((subfield: { name: any; options: any; }) => {
          let subfieldEntity = entityList.find((entityData: { value: any; }) => subfield.name === entityData.value);
          if (subfieldEntity) {
            subfield.options = subfieldEntity.entities.map((entityItem: { label: any; value: any; }) => ({ label: entityItem.label, value: entityItem.value }));
          }
        });
      }
    });
    return formData;
  }


  getFormWithEntities(form: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.getForm(PROJECT_DETAILS).subscribe((formResponse) => {
          let formData = formResponse?.result?.data?.fields || [];
          let entityNames = this.getEntityNames(formData);
          this.getEntities(entityNames).subscribe((entities) => {
            let data = this.populateEntity(formData, entities);
            resolve(data);
          }, (error) => {
            reject(error);
          });
        }, (error) => {
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });

  }

  getResourceList(params: any): Observable<any> {
    const endpoint = RESOURCE_URLS.RESOURCE_LIST;  
    const queryParams = new HttpParams({ fromObject: params });
    return this.httpService.get(endpoint, queryParams);
  }
}
