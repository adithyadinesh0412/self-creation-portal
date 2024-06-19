import { Component, Input, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent, SideNavbarComponent } from 'lib-shared-modules';
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
  data:any;
  @ViewChild('formLib') formLib: MainFormComponent | undefined
  constructor(private libProjectService:LibProjectService, private router:Router, private route:ActivatedRoute) {}
  ngOnInit() {
    this.libProjectService.currentData.subscribe(data => {
      this.data= data.res.controls
    });
    this.route.queryParams.subscribe((params:any) => {
      console.log(params)
      if(!params.projectId){
        this.libProjectService.createOrUpdateProject().subscribe((res:any) => {
          this.router.navigate([], {
            queryParams: {
              projectId: res.result.id
            },
            queryParamsHandling: 'merge'
          });
        })
      }
    });
    this.libProjectService.isProjectSave.subscribe((isProjectSave:boolean) => {
      if(isProjectSave) {
        this.saveForm();
      }
    });
  }

  saveForm() {
    console.log('Form value: ',this.formLib?.myForm.value)
  }

  ngOnDestroy() {
    this.libProjectService.createOrUpdateProject(this.formLib?.myForm.value)
  }
}
