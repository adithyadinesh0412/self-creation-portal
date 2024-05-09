import { Component } from '@angular/core';
import { HeaderComponent, SideNavbarComponent } from 'lib-shared-modules';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list'; 
import {MatCardModule} from '@angular/material/card';
import { CommonModule, Location } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent,SideNavbarComponent, MatSidenavModule, MatButtonModule, MatIconModule, MatToolbarModule, MatListModule, MatCardModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'self-creation-portal';
  backButton : boolean = true;
  subHeader : any;
  headerData : any = {};
  selectedMenuItem: any;
  selctedCardItem : any;
  titleObj = {
    "title" : "Creation Portal"
  }

  public appPages = [
    { title: 'Create New', action: "", icon: 'add',  url: 'abc',},
    { title: 'Browse Existing', action: "", icon: 'search',  url: ''},
    { title: 'Drafts', action: "", icon: 'drafts',  url: '' },
    { title: 'Submitted for Review', action: "", icon: 'send', url: ''},
    { title: 'Published', action: "", icon: 'published', url: ''},
    { title: 'Up for review', action: "", icon: 'pending', url: '' }
  ];


  cardData = [
    { title: 'Project', image:'./../assets/images/Observation icon.svg', sidenav : [
    { title: 'Project details', action: "", icon: 'add',  url: 'abc'},
    { title: 'Tasks', action: "", icon: 'search',  url: ''},
    { title: 'Subtask and resources', action: "", icon: 'search',  url: ''},
    { title: 'Certificate', action: "", icon: 'search',  url: ''},
    ], showBackButton : true
    },
    { title: 'Observation', image:'./../assets/images/Observation icon.svg', sidenav : [
      { title: 'Observation name'}
    ], showBackButton : false },
    { title: 'Observation with rubrics',image:'./../assets/images/Observation icon.svg', sidenav : [
      { title: 'Observation name'}
    ] },
    { title: 'Survey', image: './../assets/images/Survey icon.svg', sidenav : [
      { title: 'Survey name'}
    ]},
    { title: 'Programs',image: './../assets/images/Survey icon.svg', sidenav : [
      { title: 'Program details'},
      { title: 'Resources'},
      { title: 'Resource level targeting'}
    ] }
  ];

  headerDataForProjects = {
    "title":"Project Name",
    "buttons":[
      { title : 'Save as draft'},
      { title : 'Preview'},
      { title : 'Send for Review'}
    ]
   }

  constructor( private _location : Location) {

  }
 

  onMenuItemClick(item: any) {
   this.selectedMenuItem = item;
  }

  onCardClick(cardItem: any) {
    this.appPages = cardItem.sidenav
    this.backButton = cardItem.showBackButton
    this.subHeader = cardItem.subHeader;

    if (cardItem.title === 'Project') {
      this.headerData =  this.headerDataForProjects;
    } else {
        this.headerData = {};
    }
  }
  
}
