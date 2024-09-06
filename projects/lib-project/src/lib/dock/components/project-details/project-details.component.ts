import { AfterViewChecked, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { LibProjectService } from '../../../lib-project.service';
import { DynamicFormModule, MainFormComponent } from 'dynamic-form-ramkumar';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { MatDialog } from '@angular/material/dialog';
import { CommentsBoxComponent, DialogPopupComponent, FormService, UtilService } from 'lib-shared-modules';
@Component({
  selector: 'lib-project-details',
  standalone: true,
  imports: [DynamicFormModule, TranslateModule,CommentsBoxComponent],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss',
})
export class ProjectDetailsComponent implements OnDestroy, OnInit, AfterViewChecked{
  dynamicFormData: any;
  projectId: string | number = '';
  intervalId:any;
  formDataForTitle:any;
  viewOnly:boolean= false;
  mode:any="";
  commentPayload:any;
  commentsList:any = [];
  projectInReview:boolean = false;
  resourceId:string|number = '' // This variable represent projectId for comments.
  @ViewChild('formLib') formLib: MainFormComponent | undefined;
  private subscription: Subscription = new Subscription();
  constructor(
    private libProjectService: LibProjectService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private formService: FormService,
    private utilService:UtilService
  ) {
    this.startAutoSaving()
    this.subscription.add(
      this.route.queryParams.subscribe((params: any) => {
        this.mode = params.mode ? params.mode : ""
      })
    )
   }
  ngOnInit() {
    if(this.mode === 'edit' || this.mode === "" || this.mode === 'reqEdit'){
      this.libProjectService.projectData = {};
      this.getFormWithEntitiesAndMap();
      this.subscription.add(
        this.libProjectService.isProjectSave.subscribe(
          (isProjectSave: boolean) => {
            if (isProjectSave && this.router.url.includes('project-details')) {
              this.saveForm();
            }
          }
        )
      );
      this.subscription.add( // Check validation before sending for review.
        this.libProjectService.isSendForReviewValidation.subscribe(
          (reviewValidation: boolean) => {
            if(reviewValidation) {
              this.formMarkTouched();
              this.libProjectService.triggerSendForReview();
            }
          }
        )
      );
    }
    if (this.mode === 'viewOnly' || this.mode === 'review' || this.mode === 'reviewerView' || this.mode === 'creatorView') {
      this.viewOnly = true
      this.libProjectService.projectData = {};
      this.getProjectDetailsForViewOnly()
    }
  }
  ngAfterViewChecked() {
    if((this.mode == 'edit' || this.mode === 'reqEdit') && this.projectId) {
      this.libProjectService.validForm.projectDetails = (this.formLib?.myForm.status === "INVALID" || this.formLib?.subform?.myForm.status === "INVALID") ? "INVALID" : "VALID";
      if(this.libProjectService.projectData.tasks){
        const isValid = this.libProjectService.projectData.tasks.every((task: { name: any; }) => task.name);
        this.libProjectService.validForm.tasks = isValid ? "VALID" : "INVALID";
      }
    }
  }

  getProjectDetailsForViewOnly(){
    this.formService.getFormWithEntities('PROJECT_DETAILS').then((data) => {
      if (data) {
        this.formDataForTitle = data.controls.find((item:any) => item.name === 'title');
          this.subscription.add(
            this.route.queryParams.subscribe((params: any) => {
              this.projectId = params.projectId;
              if(this.mode === 'review' || this.libProjectService.projectData.status == "IN_REVIEW"){
                this.getCommentConfigs()
              }
              if (params.projectId) {
                  if (Object.keys(this.libProjectService.projectData).length > 1) { // project ID will be there so length considered as more than 1
                    this.readProjectDeatilsAndMap(data.controls,this.libProjectService.projectData);
                  } else {
                    this.subscription.add(
                      this.libProjectService
                        .readProject(this.projectId)
                        .subscribe((res: any) => {
                          this.libProjectService.setProjectData(res.result);
                          this.readProjectDeatilsAndMap(data.controls,res.result);
                          this.libProjectService.upDateProjectTitle();
                          this.libProjectService.status = res.result?.status ? res.result?.status :"DRAFT"
                        })
                    );
                  }
              }
            })
          );
      }
    })
  }

  getCommentConfigs() {
    this.subscription.add(this.route.data.subscribe((data:any) => {
      this.utilService.getCommentList(this.projectId).subscribe((commentListRes:any)=>{
        this.commentsList = this.commentsList.concat(this.utilService.filterCommentByContext(commentListRes.result.comments,data.page)) ;
        this.commentPayload = data;
        this.projectInReview = true;

        if(commentListRes.result?.comments?.length > 0){
          this.libProjectService.checkValidationForRequestChanges()
        }
        
      })
    }));
  }

  getFormWithEntitiesAndMap(){
    this.formService.getFormWithEntities('PROJECT_DETAILS').then((data) => {
      if (data) {
        this.formDataForTitle = data.controls.find((item:any) => item.name === 'title');
        this.subscription.add(
          this.route.queryParams.subscribe((params: any) => {
            this.projectId = params.projectId;
            this.libProjectService.projectData.id = params.projectId;
            if (params.projectId) {
              if (params.mode === 'edit' || this.mode === 'reqEdit') {
                if (Object.keys(this.libProjectService.projectData).length > 1) { // project ID will be there so length considered as more than 1
                  this.readProjectDeatilsAndMap(data.controls,this.libProjectService.projectData);
                } else {
                  this.subscription.add(
                    this.libProjectService
                      .readProject(this.projectId)
                      .subscribe((res: any) => {
                        this.libProjectService.setProjectData(res.result);
                        this.libProjectService.status = res.result?.status ? res.result?.status :"DRAFT"
                        this.readProjectDeatilsAndMap(data.controls,res.result);
                        this.libProjectService.upDateProjectTitle();
                        // comments list and configuration
                        if(res.result.status == "IN_REVIEW") {
                          this.getCommentConfigs()
                        }
                      })
                  );
                }
              }else{
                if (Object.keys(this.libProjectService.projectData).length > 1) { // project ID will be there so length considered as more than 1
                  this.readProjectDeatilsAndMap(data.controls,this.libProjectService.projectData);
                } else {
                  this.subscription.add(
                    this.libProjectService
                      .readProject(this.projectId)
                      .subscribe((res: any) => {
                        this.libProjectService.setProjectData(res.result);
                        this.libProjectService.status = res.result?.status ? res.result?.status :"DRAFT"
                        this.readProjectDeatilsAndMap(data.controls,res.result);
                        // comments list and configuration
                        if(res.result.status == "IN_REVIEW") {
                          this.getCommentConfigs()
                        }
                      })
                  );
                }
              }
            } else {
              this.readProjectDeatilsAndMap(data.controls,this.libProjectService.projectData);
               this.libProjectService.status = data?.status ? data?.status :"DRAFT"
            }
          })
        );
      }
    });
  }
  readProjectDeatilsAndMap(formControls:any,res: any) {
    formControls.forEach((element: any) => {
      if (Array.isArray(res[element.name])) {
        element.value = res[element.name].map((arrayItem: any) => {
          return arrayItem.value ? arrayItem.value : arrayItem;
        });
      } else {
          if(res[element.name]) {
            element.value = res[element.name].value ? res[element.name].value : res[element.name];
          }
      }
      if (element.subfields) {
        element.subfields.forEach((subElement: any) => {
          subElement.value = res[element.name]?.[subElement.name]?.value
            ? res[element.name]?.[subElement.name].value
            : res[element.name]?.[subElement.name];
        });
      }
    });
    this.dynamicFormData = formControls;
    if( this.formLib){
      this.libProjectService.validForm.projectDetails = ( this.formLib?.myForm.status === "INVALID" || this.formLib?.subform?.myForm.status === "INVALID") ? "INVALID" : "VALID";
    }
    if(this.libProjectService.projectData.tasks){
      const isValid = this.libProjectService.projectData.tasks.every((task: { description: any; }) => task.description);
      this.libProjectService.validForm.tasks = isValid ? "VALID" : "INVALID";
    }
  }
  startAutoSaving() {
    this.intervalId = setInterval(() => {
      if(!this.projectId) {
        this.createProject({title:'Untitled project'})
      } else {
        if(this.mode === 'edit' || this.mode === 'reqEdit') {
          this.subscription.add(this.libProjectService.createOrUpdateProject(this.libProjectService.projectData, this.projectId).subscribe((res)=>console.log(res)))
        }
      }
    }, 30000);
  }
  createProject(payload?:any) { // title should be send from calling methods only, due to title can be filled before project creation
      this.libProjectService
      .createOrUpdateProject(payload)
      .subscribe((res: any) => {
        (this.projectId = res.result.id),
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
              projectId: this.projectId,
              mode: 'edit',
            },
            queryParamsHandling: 'merge',
            replaceUrl: true,
          });
          this.libProjectService.projectData.id = res.result.id;
      })
  }
  saveForm() {
    if (this.libProjectService.projectData.title) {
      this.libProjectService.validForm.projectDetails = (this.formLib?.myForm.status === "INVALID" || this.formLib?.subform?.myForm.status === "INVALID") ? "INVALID" : "VALID";
      if (this.projectId) {
        this.libProjectService.updateProjectDraft(this.projectId).subscribe();
      }
      else {
        return this.createProject({title:this.libProjectService.projectData.title})
      }
    } else {
      const dialogRef = this.dialog.open(DialogPopupComponent, {
        disableClose: true,
        autoFocus : false,
        data: {
          header: 'SAVE_CHANGES',
          content: 'ADD_TITLE_TO_CONTINUE_SAVING',
          form:[this.formDataForTitle],
          exitButton: 'CONTINUE',
        },
      });
      return dialogRef
        .afterClosed()
        .toPromise()
        .then((result) => {
           if (result.data === 'CONTINUE') {
            if(result.title){
              this.libProjectService.upDateProjectTitle(result.title);
              this.libProjectService.setProjectData({title:result.title});
              this.libProjectService.status = result?.status ? result?.status :"DRAFT"
              if (this.projectId) {
                this.libProjectService.updateProjectDraft(this.projectId).subscribe();
              }
              else {
                return this.createProject(this.libProjectService.projectData)
              }
              this.getFormWithEntitiesAndMap()
              this.saveForm()
            }
            return true;
          } else {
            return false;
          }
        });
    }
  }
  getDynamicFormData(data: any) {
    const obj: { [key: string]: any } = {};
    if(this.libProjectService.projectData.title != data.title) {
      this.libProjectService.upDateProjectTitle(data.title? data.title : 'PROJECT_NAME');
    }
    if (!this.isEvent(data)) {
    this.libProjectService.setProjectData(data);
    this.libProjectService.status = data?.status ? data?.status :"DRAFT"
    this.libProjectService.validForm.projectDetails = (this.formLib?.myForm.status === "INVALID" || this.formLib?.subform?.myForm.status === "INVALID") ? "INVALID" : "VALID";
    }
  }
  isEvent(data:any) {
    return typeof data === 'object' && data !== null &&
           'type' in data && 'target' in data &&
           typeof data.preventDefault === 'function' &&
           typeof data.stopPropagation === 'function';
  };
  ngOnDestroy() {
    this.libProjectService.validForm.projectDetails = ( this.formLib?.myForm.status === "INVALID" || this.formLib?.subform?.myForm.status === "INVALID") ? "INVALID" : "VALID";
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if(this.mode === 'edit' || this.mode === 'reqEdit'){
      if(this.libProjectService.projectData.id) {
        this.libProjectService.createOrUpdateProject(this.libProjectService.projectData,this.projectId).subscribe((res)=> console.log(res))
      }
      this.libProjectService.saveProjectFunc(false);
    }
    this.subscription.unsubscribe();
  }
  formMarkTouched() {
    this.formLib?.myForm.markAllAsTouched()
    this.formLib?.subform?.myForm.markAllAsTouched()
  }

  saveComment(quillInput:any){
    if(quillInput){
        this.libProjectService.checkValidationForRequestChanges()
    }
  }
}
