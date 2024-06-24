import { Component } from '@angular/core';
import { LibProjectService } from '../../../lib-project.service';
import { FormService, HeaderComponent, SideNavbarComponent, SOLUTION_LIST, TASK_DETAILS } from 'lib-shared-modules';

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
  constructor(private libProjectService:LibProjectService,private formService:FormService) {
  }
  ngOnInit(){
    this.getProjectdata()
    this.libProjectService.currentData.subscribe(data => {
      this.sidenavData= data?.sidenavData.sidenav
      this.headerData = data?.sidenavData.headerData
    });
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
        "projectDetails":result.controls
      });
    })
    })
    .catch((error) => {
      console.error(error);
    });
  }

  onButtonClick(buttonTitle: string) {
    console.log(buttonTitle);
    if(buttonTitle === "SAVE_AS_DRAFT") {
      this.libProjectService.saveProjectFunc(true);
    }
  }
}
