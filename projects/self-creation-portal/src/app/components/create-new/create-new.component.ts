import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModelComponent, DialogPopupComponent } from '../../../../../lib-shared-modules/src/public-api';
import { MatDialog, MatDialogModule, MatDialogConfig} from '@angular/material/dialog'; 
import { Router } from '@angular/router';
import { FormService } from '../../services/form/form.service';
import { PROJECT_DETAILS } from '../../constants/formConstant';
import * as _ from 'lodash';
import { SOLUTION_LIST } from '../../constants/formConstant';


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

  resourceList : any
  
  resourceHeader = {
    "title":"PROJECT_NAME",
    "buttons":[
      { title: "SAVE_AS_DRAFT"},
      { title: "PREVIEW"},
      { title: "SEND_FOR_REVIEW"}
    ]
  }

  observationwithrubricsHeader = {
    "title" : "OBSERVATION_FORM",
    "buttons":[
      { title: "PAGINATION"},
      { title: "PROGRESS_STATUS"},
      { title: "SAVE_AS_DRAFT"},
      { title: "PREVIEW"},
      { title: "SEND_FOR_REVIEW"}
    ]
  }

  constructor(private dialog : MatDialog,private router:Router,private formService:FormService) {
  }

  ngOnInit() {
    this.getsolutionList()
  }

 async onCardClick(cardItem: any) {

    (await this.formService.getForm(PROJECT_DETAILS)).subscribe(async (form) =>{
      let formData = _.get(form.result, 'data.fields');
    let entityNames = this.formService.getEntityNames(formData);
   
    (await this.formService.getEntities(entityNames)).subscribe(async (entities) =>{
      let data = await this.formService.populateEntity(formData,entities)
      const stateData = { data : data};
      this.router.navigate(["solution/project/project-details"],{ state: stateData})
     })
    })
  }
 
  getsolutionList() {
    this.formService.getForm(SOLUTION_LIST).subscribe((form) =>{
      this.resourceList = form?.result?.data?.fields?.controls
    })
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
