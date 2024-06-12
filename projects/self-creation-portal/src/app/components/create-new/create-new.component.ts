import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialog, MatDialogModule, MatDialogConfig} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormService } from '../../services/form/form.service';
import { PROJECT_DETAILS } from '../../constants/formConstant';
import { SOLUTION_LIST } from '../../constants/formConstant';
import { LibProjectService } from 'lib-project';


@Component({
  selector: 'app-create-new',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatToolbarModule, MatListModule, MatCardModule, TranslateModule, MatDialogModule],
  templateUrl: './create-new.component.html',
  styleUrl: './create-new.component.scss'
})
export class CreateNewComponent {
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

  constructor(private dialog : MatDialog,private router:Router,private formService:FormService,private libProjectService:LibProjectService) {
  }

  ngOnInit() {
    this.getsolutionList()
  }

 onCardClick(cardItem: any) {
    this.formService.getFormWithEntities(cardItem.formName)
      .then((result) => {
        this.libProjectService.setData( {
          "res" : result,
          "sidenavData": cardItem
        });
        this.router.navigate([cardItem.url])
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getsolutionList() {
    this.formService.getForm(SOLUTION_LIST).subscribe((form) =>{
      this.resourceList = form?.result?.data?.fields?.controls
    })
  }

}
