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
