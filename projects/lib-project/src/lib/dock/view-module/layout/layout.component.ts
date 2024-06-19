import { Component } from '@angular/core';
import { LibProjectService } from '../../../lib-project.service';

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
  constructor(private libProjectService:LibProjectService) {
  }
  ngOnInit(){
    this.libProjectService.currentData.subscribe(data => {
      this.sidenavData= data.sidenavData.sidenav
      this.headerData = data.sidenavData.headerData
    });
  }

  onButtonClick(buttonTitle: string) {
    console.log(buttonTitle);
    if(buttonTitle === "SAVE_AS_DRAFT") {
      this.libProjectService.saveProjectFunc(true);
    }
  }
}
