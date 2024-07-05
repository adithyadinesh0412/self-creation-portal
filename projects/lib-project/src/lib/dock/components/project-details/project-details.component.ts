import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { LibProjectService } from '../../../lib-project.service';
import { DynamicFormModule, MainFormComponent } from 'dynamic-form-ramkumar';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { MatDialog } from '@angular/material/dialog';
import { DialogPopupComponent } from 'lib-shared-modules';


@Component({
  selector: 'lib-project-details',
  standalone: true,
  imports: [ DynamicFormModule, TranslateModule],
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
    private dialog : MatDialog
  ) {}
  ngOnInit() {
    this.subscription.add(
      this.libProjectService.currentProjectMetaData.subscribe((data) => {
        if (data) {
          this.dynamicFormData = data.projectDetails;
          this.subscription.add(
            this.route.queryParams.subscribe((params: any) => {
              this.projectId = params.projectId;
              if (params.projectId) {
                if (params.mode === 'edit') {
                  if(Object.keys(this.libProjectService.projectData).length) {
                    this.readProjectDeatilsAndMap(this.libProjectService.projectData)
                  }
                  else {

                      this.subscription.add(
                        this.libProjectService
                        .readProject(this.projectId)
                        .subscribe((res: any) => {
                          this.libProjectService.setProjectData(res.result);
                          this.readProjectDeatilsAndMap(this.libProjectService.projectData);
                          this.libProjectService.upDateProjectTitle();
                        })
                        )
                    }
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
            })
          )
        }
      })
    )
    this.subscription.add(
      this.libProjectService.isProjectSave.subscribe((isProjectSave: boolean) => {
        if (isProjectSave && this.router.url.includes('project-details')) {
          this.saveForm();
        }
      })
    );
  }

  readProjectDeatilsAndMap(res:any){
        this.dynamicFormData.forEach((element: any) => {
          if(Array.isArray(res[element.name])) {
            console.log(Array.isArray(element.value))
            element.value = res[element.name].map((arrayItem:any) => {
              return arrayItem.value ? arrayItem.value : arrayItem;
            })
          }
          else {
            element.value = res[element.name]?.value
            ? res[element.name].value
            : res[element.name];
          }
        if (element.subfields) {
          element.subfields.forEach((subElement: any) => {
              subElement.value = res[element.name]?.[
                subElement.name
              ]?.value
                ? res[element.name]?.[subElement.name].value
                : res[element.name]?.[subElement.name];
          });
        }
        if(element.type == "addResource") {
          element.value =  res[element.name]
          return
        }
        });
        console.log(this.dynamicFormData);
  }

  // canDeactivate(): Promise<any> {
  //   this.router.events.subscribe(event => {
  //     if (event instanceof NavigationStart) {
  //       console.log('Next URL:', event.url);
  //     }
  //   });
  //   if (!this.formLib?.myForm.pristine) {
  //     const dialogRef = this.dialog.open(DialogPopupComponent, {
  //       data: {
  //         header: "SAVE_CHANGES",
  //         content: "UNSAVED_CHNAGES_MESSAGE",
  //         cancelButton: "DO_NOT_SAVE",
  //         exitButton: "SAVE"
  //       }
  //     });

  //     return dialogRef.afterClosed().toPromise().then(result => {
  //       if (result === "DO_NOT_SAVE") {
  //         return true;
  //       } else if (result === "SAVE") {
  //         this.saveForm();
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     });
  //   } else {
  //     return Promise.resolve(true);
  //   }
  // }


  saveForm() {
    if(this.projectId) {
      this.libProjectService.updateProjectDraft(this.projectId);
    }
  }

  getDynamicFormData(data: any) {
    const obj: { [key: string]: any } = {};
    if (typeof data === "object") {
      console.log(data);
      this.libProjectService.setProjectData(data);
    }
  }

  ngOnDestroy() {
    this.libProjectService.validForm.projectDetails = this.formLib?.myForm.status ? this.formLib?.myForm.status: "INVALID"
    console.log(this.formLib?.myForm.status)
    this.subscription.unsubscribe();
  }

}
