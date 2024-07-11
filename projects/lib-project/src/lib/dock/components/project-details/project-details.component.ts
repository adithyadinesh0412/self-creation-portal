import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { LibProjectService } from '../../../lib-project.service';
import { DynamicFormModule, MainFormComponent } from 'dynamic-form-ramkumar';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { MatDialog } from '@angular/material/dialog';
import { DialogPopupComponent, FormService } from 'lib-shared-modules';

@Component({
  selector: 'lib-project-details',
  standalone: true,
  imports: [DynamicFormModule, TranslateModule],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss',
})
export class ProjectDetailsComponent implements OnDestroy, OnInit {
  dynamicFormData: any;
  projectId: string | number = '';
  formDataForTitle:any;
  @ViewChild('formLib') formLib: MainFormComponent | undefined;
  private subscription: Subscription = new Subscription();
  private autoSaveSubscription: Subscription = new Subscription();
  constructor(
    private libProjectService: LibProjectService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private formService: FormService
  ) { }
  ngOnInit() {
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
  }


  getFormWithEntitiesAndMap(){
    this.formService.getFormWithEntities('PROJECT_DETAILS').then((data) => {
      if (data) {
        this.formDataForTitle = data.controls.find((item:any) => item.name === 'title');
        this.subscription.add(
          this.route.queryParams.subscribe((params: any) => {
            this.projectId = params.projectId;
            if (params.projectId) {
              if (params.mode === 'edit') {
                if (Object.keys(this.libProjectService.projectData).length) {
                  this.readProjectDeatilsAndMap(data.controls,this.libProjectService.projectData);
                } else {
                  this.subscription.add(
                    this.libProjectService
                      .readProject(this.projectId)
                      .subscribe((res: any) => {
                        this.libProjectService.setProjectData(res.result);
                        this.readProjectDeatilsAndMap(data.controls,res.result);
                        this.libProjectService.upDateProjectTitle();
                      })
                  );
                }
                this.startAutoSaving();
                const mainFormStatus = this.formLib?.myForm.status ?? "INVALID";
                const subFormStatus = this.formLib?.subform?.myForm.status ?? "INVALID";
                this.libProjectService.validForm.projectDetails = (mainFormStatus === "INVALID" || subFormStatus === "INVALID") ? "INVALID" : "VALID";
              }
            } else {
              this.libProjectService
                .createOrUpdateProject()
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
                });
              this.startAutoSaving();
            }
          })
        );
      }
    if(this.libProjectService.projectData.tasks){
      this.libProjectService.validForm.tasks =  this.libProjectService.projectData.tasks[0].description ? "VALID": "INVALID"
    }
    this.libProjectService.checkValidationForSubmit()

    });
  }

  readProjectDeatilsAndMap(formControls:any,res: any) {
    formControls.forEach((element: any) => {
      if (Array.isArray(res[element.name])) {
        console.log(Array.isArray(element.value));
        element.value = res[element.name].map((arrayItem: any) => {
          return arrayItem.value ? arrayItem.value : arrayItem;
        });
      } else {
        element.value = res[element.name]?.value
          ? res[element.name].value
          : res[element.name];
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
    console.log(this.dynamicFormData);
  }

  canDeactivate(): Promise<any> {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        console.log('Next URL:', event.url);
      }
    });
    if (!this.formLib?.myForm.pristine) {
      const dialogRef = this.dialog.open(DialogPopupComponent, {
        data: {
          header: 'SAVE_CHANGES',
          content: 'UNSAVED_CHNAGES_MESSAGE',
          cancelButton: 'DO_NOT_SAVE',
          exitButton: 'SAVE',
        },
      });

      return dialogRef
        .afterClosed()
        .toPromise()
        .then((result) => {
          if (result.data === 'DO_NOT_SAVE') {
            this.libProjectService.projectData = {};
            return true;
          } else if (result.data === 'SAVE') {
            this.saveForm();
            this.libProjectService.projectData = {};
            return true;
          } else {
            return false;
          }
        });
    } else {
      return Promise.resolve(true);
    }
  }

  startAutoSaving() {
    this.autoSaveSubscription = this.libProjectService
      .startAutoSave(this.projectId)
      .subscribe((data) => console.log(data));
  }

  saveForm() {
    if (this.libProjectService.projectData.title) {
      this.libProjectService.validForm.projectDetails = (this.formLib?.myForm.status === "INVALID" || this.formLib?.subform?.myForm.status === "INVALID") ? "INVALID" : "VALID";
      this.libProjectService.checkValidationForSubmit()
      if (this.projectId) {
        this.libProjectService.updateProjectDraft(this.projectId).subscribe();
      }
      return;
    } else {
      const dialogRef = this.dialog.open(DialogPopupComponent, {
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
    if (!this.isEvent(data)) {
      if(this.libProjectService.projectData.title != data.title) {
        console.log('triggered')
        this.libProjectService.upDateProjectTitle(data.title);
      }
      this.libProjectService.setProjectData(data);
    }
  }

 
  isEvent(data:any) {
    return typeof data === 'object' && data !== null &&
           'type' in data && 'target' in data &&
           typeof data.preventDefault === 'function' &&
           typeof data.stopPropagation === 'function';
  };

  isFormChanged(obj1: any, obj2: any): boolean {
    if (obj1 === obj2) return true;

    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
      return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
      if (!keys2.includes(key) || !this.isFormChanged(obj1[key], obj2[key])) return false;
    }

    return true;
  }

  ngOnDestroy() {
    this.libProjectService.validForm.projectDetails = ( this.formLib?.myForm.status === "INVALID" || this.formLib?.subform?.myForm.status === "INVALID") ? "INVALID" : "VALID";
    this.libProjectService.checkValidationForSubmit() 
    this.subscription.unsubscribe();
    if (this.autoSaveSubscription) {
      this.autoSaveSubscription.unsubscribe();
    }
  }
}
