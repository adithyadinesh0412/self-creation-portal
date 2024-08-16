import { Component } from '@angular/core';
import { LibProjectService } from '../../../lib-project.service';
import { DialogPopupComponent, FormService, PROJECT_DETAILS_PAGE, ReviewModelComponent, SOLUTION_LIST, SUBMITTED_FOR_REVIEW, TASK_DETAILS, UtilService } from 'lib-shared-modules';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'lib-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  backButton : boolean = true;
  subHeader : any;
  selctedCardItem : any;
  headerData:any
  sidenavData:any;
  tabValidation:any;
  constructor(private libProjectService:LibProjectService,private formService:FormService,private route:ActivatedRoute,private router:Router,private dialog:MatDialog, private utilService:UtilService) {
  }
  ngOnInit(){
    this.tabValidation={
      projectDetails: "VALID",
      tasks:"VALID",
      subTasks:"VALID",
      certificates:'VALID'
    }
    this.setConfig()
    this.getProjectdata()
    this.libProjectService.currentProjectMetaData.subscribe(data => {
      this.sidenavData= data?.sidenavData.sidenav
      // data?.sidenavData.headerData.buttons.forEach((element:any) => {
      //   if(element.title == "SEND_FOR_REVIEW"){
      //     element.disable = false;
      //   }
      // });
      this.headerData = data?.sidenavData.headerData
    });
  }
  setConfig(){
    this.libProjectService.setConfig().subscribe((res:any) => {
      this.libProjectService.instanceConfig = res?.result.instance;
      this.libProjectService.projectConfig = res.result.resource.find((res:any) => res.resource_type === "projects");
    })
  }

  getProjectdata() {
    let projectData:any;
    this.formService.getForm(SOLUTION_LIST).subscribe((form) =>{
      projectData = form?.result?.data?.fields?.controls.find((item:any)=> item.title ===  "PROJECT")
    })
    this.formService.getFormWithEntities("PROJECT_DETAILS")
    .then((result) => {
      this.formService.getForm(TASK_DETAILS).subscribe((tasksData) => {
      this.libProjectService.setData( {
        "tasksData":tasksData.result.data.fields.controls,
        "sidenavData": projectData,
        "projectDetails":result.controls,
      });
      this.libProjectService.upDateProjectTitle()
      // this.route.queryParams.subscribe((params: any) => {
      //   if (params.projectId) {
      //       this.libProjectService.readProject(params.projectId).subscribe((res: any) => {
      //           this.libProjectService.projectData = res.result;
      //           this.libProjectService.upDateProjectTitle()
      //         });
      //       }
      // })
    })
    })
    .catch((error) => {
      console.error(error);
    });
  }

  onButtonClick(buttonTitle: string) {
    switch (buttonTitle) {
      case "SAVE_AS_DRAFT":{
        this.libProjectService.saveProjectFunc(true);
        break;
      }
      case "SEND_FOR_REVIEW":{
        this.libProjectService.checkSendForReviewValidation(true);
        this.tabValidation = this.libProjectService.validForm;
        break;
      }
      case "START_REVIEW":{
        this.utilService.startOrResumeReview(this.libProjectService.projectData.id).subscribe((data)=>{
        })
        this.router.navigate([PROJECT_DETAILS_PAGE], {
          queryParams: {
            projectId:  this.libProjectService.projectData.id ,
            mode: 'review'
          }
        });
        break;
      }
      case "ACCEPT":{
        const dialogRef = this.dialog.open(DialogPopupComponent, {
          autoFocus: false,
          disableClose: true,
          data: {
            header: "Accept Resource?",
            content: "Accepting this resource will publish it. Do you want to proceed?",
            cancelButton: "CANCEL",
            exitButton: "ACCEPT"
          }
        });
        dialogRef.afterClosed().toPromise().then(result => {
          if (result.data === "CANCEL") {
            return true;
          } else if (result.data === "ACCEPT") {
            let data = {
              id:this.libProjectService.projectData.id
            }
            this.utilService.approveResource(data).subscribe((data)=>{
              this.router.navigate(['/home'])
            })
            return true;
          } else {
            return false;
          }
        });
        break;
      }
      case "REJECT":{
        const dialogRef = this.dialog.open(DialogPopupComponent, {
          autoFocus: false,
          disableClose: true,
          data: {
            header: "Reject Resource?",
            content: " Rejecting this resource will prevent it from being published. Do you want to proceed?",
            cancelButton: "CANCEL",
            reportContent:true,
            form:[{
              "name": "title",
              "label": "Add a reason",
              "value": "",
              "class": "",
              "type": "text",
              "placeHolder": "Reason for reporting the content",
              "position": "floating",
              "errorMessage": {
                  "required": "Enter valid reason",
                  "pattern": "Reason can only include alphanumeric characters with spaces, -, _, &, <>",
                  "maxLength": "Reason must not exceed 256 characters"
              },
              "validators": {
                  "required": true,
                  "maxLength": 255,
                  "pattern": "^(?! )(?!.* {3})[\\p{L}a-zA-Z0-9\\-_ <>&]+$"
              }
          }],
            exitButton: "REJECT"
          }
        });
    
        dialogRef.afterClosed().toPromise().then(result => {
          if (result.data === "CANCEL") {
            return true;
          } else if (result.data === "REJECT") {
            let data={
              id:this.libProjectService.projectData.id,
              payload:{}
            }
            this.utilService.rejectOrReportedReview(data).subscribe((data)=>{
              this.router.navigate(['/home'])
            })
            return true;
          } else {
            return false;
          }
        });
        break;
      }
      case "REQUEST_CHANGES":{
        break;
      }
      default:
        break;
    }
  }

  navChangeEvent(data:any) {
    console.log(data)
  }
}
