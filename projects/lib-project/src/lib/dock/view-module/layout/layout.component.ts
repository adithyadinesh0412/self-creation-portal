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
  headerData : any = {};
  selctedCardItem : any;
  titleObj = {
    "title" : "Project name"
  }

  sidenavData:any
  constructor(private libProjectService:LibProjectService) {
  }
  ngOnInit(){
    this.libProjectService.currentData.subscribe(data => {
      this.sidenavData= data.sidenavData.sidenav
    });
  }

  onButtonClick(buttonTitle: string) {
  }
}
