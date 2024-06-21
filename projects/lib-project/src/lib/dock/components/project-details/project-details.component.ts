import { Component, Input, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService, HeaderComponent, SideNavbarComponent, SOLUTION_LIST, TASK_DETAILS } from 'lib-shared-modules';
import { Observable } from 'rxjs';
import { map} from 'rxjs/operators';
import { LibProjectService } from '../../../lib-project.service'
import { DynamicFormModule, MainFormComponent } from 'dynamic-form-ramkumar';
import { TranslateModule } from '@ngx-translate/core';




@Component({
  selector: 'lib-project-details',
  standalone: true,
  imports: [
    HeaderComponent,DynamicFormModule,TranslateModule
  ],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss'
})
export class ProjectDetailsComponent implements OnDestroy,OnInit {
  dynamicFormData:any;
  projectId:string|number ='';
  @ViewChild('formLib') formLib: MainFormComponent | undefined
  constructor(private libProjectService:LibProjectService, private router:Router, private route:ActivatedRoute, private formService:FormService) {}
  ngOnInit() {
    this.libProjectService.currentData.subscribe(data => {
      this.dynamicFormData = data.projectDetails
      this.route.queryParams.subscribe((params:any) => {
        this.projectId = params.projectId;
        console.log(this.route)
        if(params.projectId){
          if(params.mode === 'edit') {
            this.libProjectService.readProject(params.projectId).subscribe((res:any)=> {
              this.dynamicFormData.forEach((element:any) => {
                element.value = res.result[element.name].value ? res.result[element.name].value : res.result[element.name];
              })
            })
          }
        }
        else {
          this.libProjectService.createOrUpdateProject().subscribe((res:any) => {
            this.projectId = res.result.id,
            this.router.navigate([], {
              queryParams: {
                projectId: this.projectId
              },
              queryParamsHandling: 'merge'
            });
          })
        }
      });
    });
    this.libProjectService.isProjectSave.subscribe((isProjectSave:boolean) => {
      if(isProjectSave && this.router.url.includes('project-details')) {
        this.saveForm();
      }
    });
  }

  saveForm() {
    console.log('Form value: ',this.formLib?.myForm)
    if(this.projectId) {
      this.libProjectService.createOrUpdateProject(this.formLib?.myForm.value,this.projectId).subscribe((res) => console.log(res))
    }
  }

  ngOnDestroy() {
    // if(this.projectId) {
    //   this.libProjectService.createOrUpdateProject(this.formLib?.myForm.value,this.projectId).subscribe((res) => console.log(res))
    // }
  }
}
