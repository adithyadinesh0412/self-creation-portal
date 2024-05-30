import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModelComponent, DialogPopupComponent } from '../../../../../lib-shared-modules/src/public-api';
import { MatDialog, MatDialogModule, MatDialogConfig} from '@angular/material/dialog'; 

@Component({
  selector: 'app-create-new',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatToolbarModule, MatListModule, MatCardModule, TranslateModule, MatDialogModule],
  templateUrl: './create-new.component.html',
  styleUrl: './create-new.component.scss'
})
export class CreateNewComponent {
  backButton : boolean = true;
  subHeader : any;
  headerData : any = {};
  selctedCardItem : any;
  titleObj = {
    "title" : "Creation Portal"
  }

  public sidenavData = [
    { title: 'CREATE_NEW', action: "", icon: 'add', url: 'create-new',},
    { title: 'BROWSE_EXISTING', action: "", icon: 'search', url: 'browse-existing'},
    { title: 'DRAFTS', action: "", icon: 'drafts', url: 'drafts' },
    { title: 'SUBMITTED_FOR_REVIEW', action: "", icon: 'send', url: 'submit-for-review'},
    { title: 'PUBLISHED', action: "", icon: 'published', url: 'published'},
    { title: 'UP_FOR_REVIEW', action: "", icon: 'pending', url: 'up-for-review' }
  ];

  resourceList = [
    { title: 'PROJECT', image:'./../assets/images/observation.svg', 
      sidenav : [
        { title: 'PROJECT_DETAILS', action: "", icon: 'add',  url: ''},
        { title: 'TASKS', action: "", icon: 'search',  url: ''},
        { title: 'SUBTASKS_AND_RESOURCES', action: "", icon: 'search',  url: ''},
        { title: 'CERTIFICATE', action: "", icon: 'search',  url: ''},
      ], showBackButton : true
    },
    { title: 'OBSERVATION', image:'./../assets/images/observation.svg', 
      sidenav : [
        { title: 'OBSERVATION_NAME'}
      ], showBackButton : true 
    },
    { title: 'OBSERVATION_WITH_RUBRIC',image:'./../assets/images/observation.svg', 
      sidenav : [
        { title: 'OBSERVATION_NAME'}
      ] 
    },
    { title: 'SURVEY', image: './../assets/images/survey.svg', 
      sidenav : [
        { title: 'SURVEY_NAME'}
      ]
    },
    { title: 'PROGRAM',image: './../assets/images/survey.svg', 
      sidenav : [
        { title: 'PROGRAM_DETAILS'},
        { title: 'RESOURCES'},
        { title: 'RESOURCE_LEVEL_TARGETING'}
      ] 
    }
  ];
  
  resourceHeader = {
    "title":"PROJECT_NAME",
    "buttons":[
      { title: 'SAVE_AS_DRAFT'},
      { title: 'PREVIEW'},
      { title: 'SEND_FOR_REVIEW'}
    ]
  }

  observationwithrubricsHeader = {
    "title" : "OBSERVATION_FORM",
    "buttons":[
      { title: 'PAGINATION'},
      { title: 'PROGRESS_STATUS'},
      { title: 'SAVE_AS_DRAFT'},
      { title: 'PREVIEW'},
      { title: 'SEND_FOR_REVIEW'}
    ]
  }

  constructor(private dialog : MatDialog,) {
  }

  ngOnInit() {

  }

  onCardClick(cardItem: any) {
    this.sidenavData = cardItem.sidenav
    this.backButton = cardItem.showBackButton
    this.subHeader = cardItem.subHeader;

    if ((cardItem.title === 'PROJECT') || (cardItem.title === 'OBSERVATION') || (cardItem.title === 'SURVEY') || (cardItem.title === 'PROGRAM')) {
      this.headerData =  this.resourceHeader;
    }
    else if (cardItem.title === 'OBSERVATION_WITH_RUBRIC') {
      this.headerData = this.observationwithrubricsHeader;
    }
    else {
        this.headerData = {};
    }
  }
  
  openPopup() {
    const dialogRef = this.dialog.open(DialogPopupComponent, {
    data : {
      header: 'BACK',
      content: 'CHANGE_UNSAVED_MESSAGE',
      cancelButton:'CANCEL',
      exitButton: 'EXIT'
    }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogModelComponent, { 
    data : {
    header: 'ADD_LEARNING_RESOURCE',
    labelname: 'RESOURCE_NAME',
    resourceName:'Name',
    labellink: 'RESOURCE_LINK',
    resourceLink:'Link',
    cancelButton: 'CANCEL',
    saveButton: 'SAVE',
    addResource: 'ADD_LEARNING_RESOURCE'
    }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  onButtonClick(buttonTitle: string) {
  }
}
