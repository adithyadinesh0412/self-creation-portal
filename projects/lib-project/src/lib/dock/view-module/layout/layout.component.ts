import { Component } from '@angular/core';

@Component({
  selector: 'lib-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
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
