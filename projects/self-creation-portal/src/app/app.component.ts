import { Component } from '@angular/core';
import { HeaderComponent, SideNavbarComponent, DialogModelComponent } from 'lib-shared-modules';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list'; 
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogConfig} from '@angular/material/dialog'; 
import { TranslateModule,TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, SideNavbarComponent, DialogModelComponent, MatSidenavModule, MatButtonModule, MatIconModule, MatToolbarModule, MatListModule, MatCardModule,TranslateModule],
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
    { title: 'CREATE_NEW', action: "", icon: 'add', url: '',},
    { title: 'BROWSE_EXISTING', action: "", icon: 'search', url: ''},
    { title: 'DRAFTS', action: "", icon: 'drafts', url: '' },
    { title: 'SUBMITTED_FOR_REVIEW', action: "", icon: 'send', url: ''},
    { title: 'PUBLISHED', action: "", icon: 'published', url: ''},
    { title: 'UP_FOR_REVIEW', action: "", icon: 'pending', url: '' }
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


  constructor(private translate: TranslateService, private dialog : MatDialog) {
    this.initializeTranslation();
  }
  
  private initializeTranslation(): void {
    this.translate.setDefaultLang('en');
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

  onButtonClick(buttonTitle: string) {
  }
  
  dialogData = [
    {
      "header": '',
      "content": 'Changes will not be saved, do you want to go back?',
      "buttons": [
        { title: 'Yes'},
        { title: 'No' }
      ]
    },
    {
      "header": 'Exit review?',
      "content": 'Exiting the review will delete any comments or progress made on this resource. Are you sure you want to exit the review?',
      "buttons": [
        { title: 'Cancel'},
        { title: 'Exit' }
      ]
    },
    {
      "header": 'Delete resource?',
      "content": 'Exiting the review will delete any comments or progress made on this resource. Are you sure you want to exit the reviewing?',
      "buttons": [
        { title: 'Cancel'},
        { title: 'Delete' }
      ]
    },
    {
      "header": 'Delete resource?',
      "content": 'Would you like to delete the selected resources?',
      "buttons": [
        { title: 'Cancel'},
        { title: 'Delete' }
      ]
    }
  ]
  
  modalData = [
    {
      "header": 'Add learning resources?',
      "content": [
        { title: 'Name of the resource', input : ''},
        { title: 'Link to the resource', input : ''},
        { button: 'Add learning resource'}
      ],
      "buttons": [
        { title: 'Cancel'},
        { title: 'Save' }
      ]
    },
    {
      "header": 'Attach logo',
      "content": [
        { title: 'Attach logos'},
        { title: 'Make sure your file:'}
      ],
      'files': [
        { title: 1, content: 'Is 80px X 80px in dimension'},
        { title: 2, content: 'Size <= 50kb'},
        { title: 3, content: 'File type - PNG only'}
      ],
      'card': 'Select file to upload',
      "buttons": 'Attach'
    },
    {
      "header": 'Attach Signature',
      "subheader": 'Add Signature details',
      "content": [
        { title: 'Signature Name', input: ''},
        { title: 'Signature Designation', input: ''}
      ],
      'files': [
        { title: 1, content: '112px height X 46px base'},
        { title: 2, content: 'Size <= 50kb'},
        { title: 3, content: 'File type - PNG only'}
      ],
      'card': 'Select file to upload',
      "buttons": 'Attach'
    }
  ]

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "280px";
    dialogConfig.height = "150px";
    dialogConfig.data = this.dialogData;
    const dialogRef = this.dialog.open(DialogModelComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
