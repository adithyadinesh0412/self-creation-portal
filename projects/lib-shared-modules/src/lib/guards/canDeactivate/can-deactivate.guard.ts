import { CanDeactivateFn, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

export const canDeactivateGuard: CanDeactivateFn<CanComponentDeactivate> = (component: CanComponentDeactivate,currentRoute: import('@angular/router').ActivatedRouteSnapshot,
currentState: RouterStateSnapshot,
nextState?: RouterStateSnapshot) => {
  if(nextState && nextState.url.includes('tasks') || nextState && nextState.url.includes('sub-tasks')) {
    return true;
  }
  else {
    return component.canDeactivate ? component.canDeactivate() : true
  }
};
