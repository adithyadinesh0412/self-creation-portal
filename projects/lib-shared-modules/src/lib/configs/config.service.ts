import { Injectable } from '@angular/core';
import * as urlConfig from './url.config.json'
import * as labelConFig from './label.config.json'


@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  urlConFig = (urlConfig as any);
  labelConFig = (labelConFig as any);
}
