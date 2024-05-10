import { Component } from '@angular/core';
import { HeaderComponent, SideNavbarComponent } from 'lib-shared-modules';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list'; 
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent,SideNavbarComponent, MatSidenavModule, MatButtonModule, MatIconModule, MatToolbarModule, MatListModule, MatCardModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  backButton : boolean = true;
  subHeader : any;
  headerData : any = {};
  selctedCardItem : any;
  titleObj = {
    "title" : "Creation Portal"
  }

  public sidenavData = [
    { title: 'Create New', action: "", icon: 'add', url: '',},
    { title: 'Browse Existing', action: "", icon: 'search', url: ''},
    { title: 'Drafts', action: "", icon: 'drafts', url: '' },
    { title: 'Submitted for Review', action: "", icon: 'send', url: ''},
    { title: 'Published', action: "", icon: 'published', url: ''},
    { title: 'Up for review', action: "", icon: 'pending', url: '' }
  ];

  resourceList = [
    { title: 'Project', image:'./../assets/images/observation.svg', 
      sidenav : [
        { title: 'Project details', action: "", icon: 'add',  url: ''},
        { title: 'Tasks', action: "", icon: 'search',  url: ''},
        { title: 'Subtask and resources', action: "", icon: 'search',  url: ''},
        { title: 'Certificate', action: "", icon: 'search',  url: ''},
      ], showBackButton : true
    },
    { title: 'Observation', image:'./../assets/images/observation.svg', 
      sidenav : [
        { title: 'Observation name'}
      ], showBackButton : true 
    },
    { title: 'Observation with rubrics',image:'./../assets/images/observation.svg', 
      sidenav : [
        { title: 'Observation name'}
      ] 
    },
    { title: 'Survey', image: './../assets/images/survey.svg', 
      sidenav : [
        { title: 'Survey name'}
      ]
    },
    { title: 'Programs',image: './../assets/images/survey.svg', 
      sidenav : [
        { title: 'Program details'},
        { title: 'Resources'},
        { title: 'Resource level targeting'}
      ] 
    }
  ];

  projectHeader = {
    "title":"Project Name",
    "buttons":[
      { title : 'Save as draft'},
      { title : 'Preview'},
      { title : 'Send for Review'}
    ]
   }

  constructor() {

  }

  onCardClick(cardItem: any) {
    this.sidenavData = cardItem.sidenav
    this.backButton = cardItem.showBackButton
    this.subHeader = cardItem.subHeader;

    if (cardItem.title === 'Project') {
      this.headerData =  this.projectHeader;
    } else {
        this.headerData = {};
    }
  }
  
}
