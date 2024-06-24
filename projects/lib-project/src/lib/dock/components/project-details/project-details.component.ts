import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import {
  FormService,
  HeaderComponent,
  SideNavbarComponent,
  SOLUTION_LIST,
  TASK_DETAILS,
} from 'lib-shared-modules';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LibProjectService } from '../../../lib-project.service';
import { DynamicFormModule, MainFormComponent } from 'dynamic-form-ramkumar';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'lib-project-details',
  standalone: true,
  imports: [HeaderComponent, DynamicFormModule, TranslateModule],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss',
})
export class ProjectDetailsComponent implements OnDestroy, OnInit {
  dynamicFormData: any;
  projectId: string | number = '';
  @ViewChild('formLib') formLib: MainFormComponent | undefined;
  private subscription: Subscription = new Subscription();
  constructor(
    private libProjectService: LibProjectService,
    private router: Router,
    private route: ActivatedRoute,
    private formService: FormService,
    private _snackBar:MatSnackBar
  ) {}
  ngOnInit() {
    this.libProjectService.currentData.subscribe((data) => {
      if (data) {
        this.dynamicFormData = data.projectDetails;
        this.route.queryParams.subscribe((params: any) => {
          this.projectId = params.projectId;
          if (params.projectId) {
            if (params.mode === 'edit') {
              this.libProjectService
                .readProject(params.projectId)
                .subscribe((res: any) => {
                  this.libProjectService.projectData = res.result;
                  this.dynamicFormData.forEach((element: any) => {
                    element.value = res.result[element.name]?.value
                      ? res.result[element.name].value
                      : res.result[element.name];
                    if (element.subfields) {
                      element.subfields.forEach((subElement: any) => {
                          subElement.value = res.result[element.name]?.[
                            subElement.name
                          ]?.value
                            ? res.result[element.name]?.[subElement.name].value
                            : res.result[element.name]?.[subElement.name];
                      });
                    }
                  });
                });
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
                      mode:'edit'
                    },
                    queryParamsHandling: 'merge',
                    replaceUrl: true
                  });
              });
          }
        });
      }
    });
    this.subscription.add(
      this.libProjectService.isProjectSave.subscribe((isProjectSave: boolean) => {
        if (isProjectSave && this.router.url.includes('project-details')) {
          this.saveForm();
        }
      })
    );
  }

  saveForm() {
    if(this.projectId) {
      this.libProjectService.updateProjectDraft(this.projectId).subscribe((res) => {
        this.libProjectService.readProject(this.projectId).subscribe((response:any) => {
          this.libProjectService.projectData = response.result;
          this.libProjectService.openSnackBar()
        })
      })
    }
  }

  getDynamicFormData(data: any) {
    const obj: { [key: string]: any } = {};
    if (typeof data === "object") {
      this.libProjectService.updateProjectData(data);
    }
  }

  ngOnDestroy() {
    this.saveForm();
    this.libProjectService.saveProjectFunc(false);
    this.subscription.unsubscribe();
  }

}
