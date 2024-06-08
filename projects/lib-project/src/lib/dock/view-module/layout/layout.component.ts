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
  headerData : any = {
    title:"Project name",
    buttons: [{
      title: "SAVE_AS_DRAFT",
      disable:false
    },
    {
      title: "PREVIEW",
      disable:false
    },
    {
      title: "SEND_FOR_REVIEW",
      disable:true
    }
  ]
  };
  selctedCardItem : any;

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
