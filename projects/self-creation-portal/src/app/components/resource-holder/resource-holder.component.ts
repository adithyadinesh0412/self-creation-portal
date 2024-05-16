import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent, SideNavbarComponent } from '../../../../../lib-shared-modules/src/public-api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-resource-holder',
  standalone: true,
  imports: [HeaderComponent,SideNavbarComponent,MatSidenavModule, MatButtonModule, MatIconModule, MatToolbarModule, MatListModule, MatCardModule],
  templateUrl: './resource-holder.component.html',
  styleUrl: './resource-holder.component.scss',
})
export class ResourceHolderComponent {
  backButton : boolean = true;
  subHeader : any;
  headerData : any = {};
  selctedCardItem : any;
  titleObj = {
    "title" : "Creation Portal"
  }

  public sidenavData = [
    { title: 'Project Details', action: "", icon: 'add', url: '',},
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
    { title: 'Program',image: './../assets/images/survey.svg',
      sidenav : [
        { title: 'Program details'},
        { title: 'Resources'},
        { title: 'Resource level targeting'}
      ]
    }
  ];

  resourceHeader = {
    "title":"Project Name",
    "buttons":[
      { title : 'Save as draft'},
      { title : 'Preview'},
      { title : 'Send for Review'}
    ]
  }

  observationwithrubricsHeader = {
    "title" : "Observation Form",
    "buttons":[
      { title : 'Pagination'},
      { title : 'Progress Status'},
      { title : 'Save as draft'},
      { title : 'Preview'},
      { title : 'Send for Review'}
    ]
  }


  constructor(private translate: TranslateService) {
    this.initializeTranslation();
  }

  private initializeTranslation(): void {
    this.translate.setDefaultLang('en');
  }

  onCardClick(cardItem: any) {
    this.sidenavData = cardItem.sidenav
    this.backButton = cardItem.showBackButton
    this.subHeader = cardItem.subHeader;

    if ((cardItem.title === 'Project') || (cardItem.title === 'Observation') || (cardItem.title === 'Survey') || (cardItem.title === 'Program')) {
      this.headerData =  this.resourceHeader;
    }
    else if (cardItem.title === 'Observation with rubrics') {
      this.headerData = this.observationwithrubricsHeader;
    }
    else {
        this.headerData = {};
    }
  }

  onButtonClick(buttonTitle: string) {
  }
}
