import { Component } from '@angular/core';
import { LibProjectService } from '../../../lib-project.service';
import { FormService, ReviewModelComponent, SOLUTION_LIST, SUBMITTED_FOR_REVIEW, TASK_DETAILS } from 'lib-shared-modules';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'lib-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  backButton : boolean = true;
  subHeader : any;
  selctedCardItem : any;
  headerData:any
  sidenavData:any
  constructor(private libProjectService:LibProjectService,private formService:FormService,private route:ActivatedRoute,private dialog : MatDialog,private router:Router,) {
  }
  ngOnInit(){
    this.libProjectService.validForm={
      projectDetails: "INVALID",
      tasks:"INVALID"
    }
    this. setConfig()
    this.getProjectdata()
    this.libProjectService.currentProjectMetaData.subscribe(data => {
      this.sidenavData= data?.sidenavData.sidenav
      // data?.sidenavData.headerData.buttons.forEach((element:any) => {
      //   if(element.title == "SEND_FOR_REVIEW"){
      //     element.disable = false;
      //   }
      // });
      this.libProjectService.checkValidationForSubmit()
      this.headerData = data?.sidenavData.headerData
    });
  }
  setConfig(){
    this.libProjectService.setConfig().subscribe((res:any) => {
      this.libProjectService.auto_save_interval =res?.result.instance?.auto_save_interval
      let project = res.result.resource.find((res:any) => res.resource_type === "projects");
      this.libProjectService.maxTaskCount = project.max_task_count
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
        this.libProjectService.checkValidationForSubmit()
        this.libProjectService.saveProjectFunc(true);
        break;
      }
      case "SEND_FOR_REVIEW":
        this.libProjectService.getReviewerData().subscribe((list:any) =>{
          const dialogRef = this.dialog.open(ReviewModelComponent, {
            disableClose: true,
            data : {
              header: "SEND_FOR_REVIEW",
              reviewdata: list.result.data,
              sendForReview: "SEND_FOR_REVIEW"
            }
          });
          dialogRef.afterClosed().subscribe(result => {
            if(result.sendForReview == "SEND_FOR_REVIEW"){
              this.libProjectService
              .createOrUpdateProject(this.libProjectService.projectData,this.libProjectService.projectData.id).subscribe((res) => {
              this.route.queryParams.subscribe((params: any) => {
                if (params.projectId) {
                  const reviewer_ids = (result.selectedValues.length === list.result.data.length)? {} : { "reviewer_ids" : result.selectedValues.map((item:any) => item.id) } ;
                  this.libProjectService.sendForReview(reviewer_ids,params.projectId).subscribe((res:any) =>{
                    this.router.navigate([SUBMITTED_FOR_REVIEW]);
                  })
                }
              })
            })
            }
            return true;
          });
        })
        break;
      default:
            break;
    }
  }
}
