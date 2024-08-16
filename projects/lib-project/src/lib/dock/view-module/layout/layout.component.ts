import { Component } from '@angular/core';
import { LibProjectService } from '../../../lib-project.service';
import { DialogPopupComponent, FormService, PROJECT_DETAILS_PAGE, ReviewModelComponent, SOLUTION_LIST, SUBMITTED_FOR_REVIEW, TASK_DETAILS, ToastService, UtilService,rejectform } from 'lib-shared-modules';
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
        this.libProjectService.startOrResumeReview()
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
            this.libProjectService.approveProject()
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
            form:[rejectform],
            exitButton: "REJECT"
          }
        });
    
        dialogRef.afterClosed().toPromise().then(result => {
          if (result.data === "CANCEL") {
            return true;
          } else if (result.data === "REJECT") {
            this.libProjectService.rejectProject()
            return true;
          } else {
            return false;
          }
        });
        break;
      }
      case "REQUEST_CHANGES":{
        this.libProjectService.sendForRequestChange()      
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
