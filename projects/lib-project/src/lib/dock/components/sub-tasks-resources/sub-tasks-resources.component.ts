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
  backButton : boolean = true;
  subHeader : any;
  headerData : any = {};
  selctedCardItem : any;
  titleObj = {
    "title" : "CREATION_PORTAL"
  }

  public sidenavData = [
    { title: 'CREATE_NEW', action: "", icon: 'add', url: 'create-new',},
    { title: 'BROWSE_EXISTING', action: "", icon: 'search', url: 'browse-existing'},
    { title: 'DRAFTS', action: "", icon: 'drafts', url: 'drafts' },
    { title: 'SUBMITTED_FOR_REVIEW', action: "", icon: 'send', url: 'submit-for-review'},
    { title: 'PUBLISHED', action: "", icon: 'published', url: 'published'},
    { title: 'UP_FOR_REVIEW', action: "", icon: 'pending', url: 'up-for-review' }
  ];

  constructor() {
  }

  onButtonClick(buttonTitle: string) {
  }
}
