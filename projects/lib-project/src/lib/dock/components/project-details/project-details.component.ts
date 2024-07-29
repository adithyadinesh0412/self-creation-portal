import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LibProjectService } from '../../../lib-project.service';
import { DynamicFormModule, MainFormComponent } from 'dynamic-form-ramkumar';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogPopupComponent, FormService } from 'lib-shared-modules';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-project-details',
  standalone: true,
  imports: [CommonModule, DynamicFormModule, TranslateModule],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss',
})
export class ProjectDetailsComponent implements OnDestroy, OnInit {
  dynamicFormData: any;
  projectId: string | number = '';
  intervalId: any;
  formDataForTitle: any;
  viewOnly: boolean = false;
  mode: any = '';
  @ViewChild('formLib') formLib: MainFormComponent | undefined;
  private subscription: Subscription = new Subscription();

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
  }

  getFormWithEntitiesAndMap() {
    this.formService.getFormWithEntities('PROJECT_DETAILS').then((data) => {
      if (data) {
        this.formDataForTitle = data.controls.find((item: any) => item.name === 'title');
        this.subscription.add(
          this.route.queryParams.subscribe((params: any) => {
            this.projectId = params.projectId;
            this.libProjectService.projectData.id = params.projectId;
            this.mode = params.mode;
            if (params.projectId) {
              this.handleProjectData(data, params);
            } else {
              this.startAutoSaving();
              this.readProjectDetailsAndMap(data.controls, this.libProjectService.projectData);
            }
          })
        );
      }
    });
  }

  handleProjectData(data: any, params: any) {
    if (params.mode === 'edit') {
      this.startAutoSaving();
      this.libProjectService.projectData = {};
      this.fetchAndMapProjectData(data.controls);
      this.subscription.add(
        this.libProjectService.isProjectSave.subscribe((isProjectSave: boolean) => {
          if (isProjectSave && this.router.url.includes('project-details')) {
            this.saveForm();
          }
        })
      );
    } else if (params.mode === 'viewOnly') {
      this.fetchAndMapProjectData(data.controls);
      this.viewOnly = true;
    }
  }

  fetchAndMapProjectData(controls: any) {
    if (Object.keys(this.libProjectService.projectData).length > 1) {
      this.readProjectDetailsAndMap(controls, this.libProjectService.projectData);
    } else {
      this.subscription.add(
        this.libProjectService.readProject(this.projectId).subscribe((res: any) => {
          this.libProjectService.setProjectData(res.result);
          this.readProjectDetailsAndMap(controls, res.result);
          this.libProjectService.upDateProjectTitle();
        })
      );
    }
  }

  readProjectDetailsAndMap(formControls: any, res: any) {
    formControls.forEach((element: any) => {
      if (Array.isArray(res[element.name])) {
        element.value = res[element.name].map((arrayItem: any) => arrayItem.value || arrayItem);
      } else {
        element.value = res[element.name]?.value || res[element.name];
      }
      if (element.subfields) {
        element.subfields.forEach((subElement: any) => {
          subElement.value = res[element.name]?.[subElement.name]?.value || res[element.name]?.[subElement.name];
        });
      }
    });
    this.dynamicFormData = formControls;
    this.updateFormValidity();
  }

  updateFormValidity() {
    if (this.formLib) {
      this.libProjectService.validForm.projectDetails = 
        (this.formLib.myForm.status === 'INVALID' || this.formLib.subform?.myForm.status === 'INVALID') ? 'INVALID' : 'VALID';
    }
    if (this.libProjectService.projectData.tasks) {
      const isValid = this.libProjectService.projectData.tasks.every((task: { description: any }) => task.description);
      this.libProjectService.validForm.tasks = isValid ? 'VALID' : 'INVALID';
    }
    this.libProjectService.checkValidationForSubmit();
  }

  startAutoSaving() {
    this.intervalId = setInterval(() => {
      if (!this.projectId) {
        this.createProject({ title: 'Untitled project' });
      } else {
        this.subscription.add(
          this.libProjectService.createOrUpdateProject(this.libProjectService.projectData, this.projectId).subscribe()
        );
      }
    }, 30000);
  }

  createProject(payload?: any) {
    this.libProjectService.createOrUpdateProject(payload).subscribe((res: any) => {
      this.projectId = res.result.id;
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { projectId: this.projectId, mode: 'edit' },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
      this.libProjectService.projectData.id = res.result.id;
    })
  }

  saveForm() {
    if (this.libProjectService.projectData.title) {
      this.updateFormValidity();
      if (this.projectId) {
        this.libProjectService.updateProjectDraft(this.projectId).subscribe();
      } else {
        this.createProject({ title: this.libProjectService.projectData.title });
      }
    } else {
      this.promptForTitle();
    }
  }

  promptForTitle() {
    const dialogRef = this.dialog.open(DialogPopupComponent, {
      disableClose: true,
      autoFocus: false,
      data: {
        header: 'SAVE_CHANGES',
        content: 'ADD_TITLE_TO_CONTINUE_SAVING',
        form: [this.formDataForTitle],
        exitButton: 'CONTINUE',
      },
    });

    dialogRef.afterClosed().toPromise().then((result) => {
      if (result.data === 'CONTINUE' && result.title) {
        this.libProjectService.upDateProjectTitle(result.title);
        this.libProjectService.setProjectData({ title: result.title });
        if (this.projectId) {
          this.libProjectService.updateProjectDraft(this.projectId).subscribe();
        } else {
          this.createProject(this.libProjectService.projectData);
        }
        this.getFormWithEntitiesAndMap();
        this.saveForm();
      }
    });
  }

  getDynamicFormData(data: any) {
    console.log(data);
    if (!this.isEvent(data)) {
      if (this.libProjectService.projectData.title !== data.title) {
        this.libProjectService.upDateProjectTitle(data.title);
      }
      this.libProjectService.setProjectData(data);
      this.updateFormValidity();
    }
  }

  isEvent(data: any) {
    return typeof data === 'object' && data !== null &&
           'type' in data && 'target' in data &&
           typeof data.preventDefault === 'function' &&
           typeof data.stopPropagation === 'function';
  };

  ngOnDestroy() {
    if (this.mode === 'edit') {
      this.updateFormValidity();
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      this.saveOrCreateProject();
    }
    this.subscription.unsubscribe();
  }

  saveOrCreateProject() {
    if (this.projectId) {
      this.libProjectService.createOrUpdateProject(this.libProjectService.projectData, this.projectId).subscribe();
      this.libProjectService.saveProjectFunc(false);
    } else {
      this.libProjectService.saveProjectFunc(false);
    }
  }
}
