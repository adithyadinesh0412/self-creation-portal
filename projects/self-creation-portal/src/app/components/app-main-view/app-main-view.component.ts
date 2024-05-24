import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { HeaderComponent, SideNavbarComponent} from '../../../../../lib-shared-modules/src/public-api';



@Component({
  selector: 'app-main-view',
  standalone: true,
  imports: [HeaderComponent,SideNavbarComponent, MatSidenavModule, MatButtonModule, MatIconModule, MatToolbarModule, MatListModule, MatCardModule, RouterModule],
  templateUrl: './app-main-view.component.html',
  styleUrl: './app-main-view.component.scss'
})
export class AppMainViewComponent {

  backButton : boolean = true;
  subHeader : any;
  headerData : any = {};
  selctedCardItem : any;
  titleObj = {
    "title" : "CREATION_PORTAL"
  }

  public sidenavData = [
    { title: 'CREATE_NEW', action: "", icon: 'add', url: 'create-new',},
    { title: 'BROWSE_EXISTING', action: "", icon: 'search', url: 'browse-existing'},
    { title: 'DRAFTS', action: "", icon: 'drafts', url: 'drafts' },
    { title: 'SUBMITTED_FOR_REVIEW', action: "", icon: 'send', url: 'submit-for-review'},
    { title: 'PUBLISHED', action: "", icon: 'published', url: 'published'},
    { title: 'UP_FOR_REVIEW', action: "", icon: 'pending', url: 'up-for-review' }
  ];

  constructor() {
  }

  onButtonClick(buttonTitle: string) {
  }
}
