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
    this.getSideNavdata()
    this.libProjectService.isProjectSave.subscribe((isProjectSave:boolean) => {
      if(isProjectSave) {
        console.log("project save")
        this.saveForm();
      }
    });
  }

  getSideNavdata() {
    let projectData:any;
    this.formService.getForm(SOLUTION_LIST).subscribe((form) =>{
      projectData = form?.result?.data?.fields?.controls.find((item:any)=> item.title ===  "PROJECT")
    })
    this.formService.getFormWithEntities("PROJECT_DETAILS")
    .then((result) => {
      console.log(result)
      this.route.queryParams.subscribe((params:any) => {
        console.log(params)
        if( params.projectId || params.mode === 'edit'){
          this.projectId = params.projectId;
            this.libProjectService.readProject(params.projectId).subscribe((res:any)=> {
              console.log(res);
              result.controls.forEach((element:any) => {
                element.value = res.result[element.name].value ? res.result[element.name].value : res.result[element.name];
              })
            })
        }
        else {
          this.libProjectService.createOrUpdateProject().subscribe((res:any) => {
            this.projectId = res.result.id
            this.router.navigate([], {
              queryParams: {
                projectId: this.projectId
              },
              queryParamsHandling: 'merge'
            });
          })
        }
      });
      this.formService.getForm(TASK_DETAILS).subscribe((tasksData) => {
      this.libProjectService.setData( {
        "tasksData":tasksData.result.data.fields.controls,
        "sidenavData": projectData
      });
      console.log(tasksData)
      this.dynamicFormData = result.controls;
    })
    })
    .catch((error) => {
      console.error(error);
    });
  }

  saveForm() {
    console.log('Form value: ',this.formLib?.myForm.value)
    if(this.projectId) {
      this.libProjectService.createOrUpdateProject(this.formLib?.myForm.value,this.projectId).subscribe((res) => console.log(res))
    }
  }

  ngOnDestroy() {
    if(this.projectId) {
      this.libProjectService.createOrUpdateProject(this.formLib?.myForm.value,this.projectId).subscribe((res) => console.log(res))
    }
  }
}
