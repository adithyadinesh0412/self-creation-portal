import { Component } from '@angular/core';
import { HeaderComponent, SideNavbarComponent } from 'lib-shared-modules';

@Component({
  selector: 'lib-tasks',
  standalone: true,
  imports: [HeaderComponent,SideNavbarComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {
  backButton : boolean = true;
  subHeader : any;
  headerData : any = {};
  selctedCardItem : any;
  titleObj = {
    "title" : "Project name"
  }

  public sidenavData = [
    { title: 'PROJECT_DETAILS', action: "", icon: 'add',  url: 'project-details'},
        { title: 'TASKS', action: "", icon: 'search',  url: 'project-details'},
        { title: 'SUBTASKS_AND_RESOURCES', action: "", icon: 'search',  url: 'sub-tasks'},
        { title: 'CERTIFICATE', action: "", icon: 'search',  url: 'project-details'},
  ];


  constructor() {
  }

  onButtonClick(buttonTitle: string) {
  }
}
