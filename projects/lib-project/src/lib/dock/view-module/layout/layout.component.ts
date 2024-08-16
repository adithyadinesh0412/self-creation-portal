import { Component } from '@angular/core';
import { LibProjectService } from '../../../lib-project.service';
import { DialogPopupComponent, FormService, PROJECT_DETAILS_PAGE, ReviewModelComponent, SOLUTION_LIST, SUBMITTED_FOR_REVIEW, TASK_DETAILS, ToastService, UtilService } from 'lib-shared-modules';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs/internal/Subscription';

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
  private subscription: Subscription = new Subscription();
  constructor(private libProjectService:LibProjectService,private formService:FormService,private route:ActivatedRoute,private router:Router,private dialog:MatDialog, private utilService:UtilService,private toastService:ToastService) {
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
    this.subscription.add(
      this.libProjectService.currentProjectMetaData.subscribe(data => {
        this.sidenavData= data?.sidenavData.sidenav
        // data?.sidenavData.headerData.buttons.forEach((element:any) => {
        //   if(element.title == "SEND_FOR_REVIEW"){
        //     element.disable = false;
        //   }
        // });
        this.headerData = data?.sidenavData.headerData
      })
    )
  }
  setConfig(){
    this.subscription.add(
    this.libProjectService.setConfig().subscribe((res:any) => {
      this.libProjectService.instanceConfig = res?.result.instance;
      this.libProjectService.projectConfig = res.result.resource.find((res:any) => res.resource_type === "projects");
    })
    )
  }

  getProjectdata() {
    let projectData:any;
    this.subscription.add(
    this.formService.getForm(SOLUTION_LIST).subscribe((form) =>{
      projectData = form?.result?.data?.fields?.controls.find((item:any)=> item.title ===  "PROJECT")
    })
  )
    this.formService.getFormWithEntities("PROJECT_DETAILS")
    .then((result) => {
      this.subscription.add(
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
   )
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
        this.subscription.add(
          this.utilService.startOrResumeReview(this.libProjectService.projectData.id).subscribe((data)=>{})
        )
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
            header: "ACCEPT_RESOURCE",
            content: "ACCEPT_RESOURCE_CONTENT",
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
            this.subscription.add(
              this.utilService.approveResource(data).subscribe((res:any)=>{
                let data = {
                  message : res.message,
                  class : 'success'
                }
                this.toastService.openSnackBar(data)
                this.router.navigate(['/home'])
              })
            )
           
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
            header: "REJECT_RESOURCES",
            content: "REJECT_RESOURCES_CONTENT",
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
            this.subscription.add(
              this.utilService.rejectOrReportedReview(data).subscribe((res:any)=>{
                let data = {
                  message : res.message,
                  class : 'success'
                }
                this.toastService.openSnackBar(data)
                this.router.navigate(['/home'])
              })
            )
            return true;
          } else {
            return false;
          }
        });
        break;
      }
      case "REQUEST_CHANGES":{
        let data = {
          id : this.libProjectService.projectData.id,
          payload:{}
        }
        this.subscription.add(
          this.utilService.updateReview(data).subscribe((data)=>{
            this.router.navigate(['/home'])
          })
        )
        break;
      }
      default:
        break;
    }
  }

  navChangeEvent(data:any) {
    console.log(data)
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
