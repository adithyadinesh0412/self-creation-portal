import { Component } from '@angular/core';
import { HeaderComponent, SideNavbarComponent } from 'lib-shared-modules';

@Component({
  selector: 'lib-sub-tasks-resources',
  standalone:true,
  imports: [
    HeaderComponent,
    SideNavbarComponent
  ],
  templateUrl: './sub-tasks-resources.component.html',
  styleUrl: './sub-tasks-resources.component.css'
})
export class SubTasksResourcesComponent {
}
