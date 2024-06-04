import { Component } from '@angular/core';
import { HeaderComponent, SideNavbarComponent } from 'lib-shared-modules';

@Component({
  selector: 'lib-project-details',
  standalone: true,
  imports: [
    HeaderComponent,
  ],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.css'
})
export class ProjectDetailsComponent {
  backButton : boolean = true;
  subHeader : any;
  headerData : any = {};
  selctedCardItem : any;
  titleObj = {
    "title" : "Project name"
  }

  constructor() {
  }

  onButtonClick(buttonTitle: string) {
  }
}
