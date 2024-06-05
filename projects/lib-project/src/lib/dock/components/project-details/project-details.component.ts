
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DynamicFormModule } from '@elevate/dynamic-form';
import { HeaderComponent, SideNavbarComponent } from 'lib-shared-modules';
import { Observable } from 'rxjs';
import { map} from 'rxjs/operators';


interface State {
    [key: string]: any;
  }

@Component({
  selector: 'lib-project-details',
  standalone: true,
  imports: [
    HeaderComponent,
    SideNavbarComponent,
    DynamicFormModule
  ],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.css'
})
export class ProjectDetailsComponent {
  state$: Observable<State> | undefined;
  data:any;
  stateSubscription: any;

  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(){
    this.state$ = this.activatedRoute.paramMap
    .pipe(map(() => window.history.state));

  // Subscribe to the state$ observable to log the state to the console
  this.stateSubscription = this.state$.subscribe(state => {
    this.data = state['data'].controls
  });
  }

}
