import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { FormService } from '../../../../../lib-shared-modules/src/lib/services/form/form.service';
import { SIDE_NAV_DATA } from '../../../../../lib-shared-modules/src/lib/constants/formConstant';
import { HeaderComponent, SideNavbarComponent } from 'lib-shared-modules';


@Component({
  selector: 'app-main-view',
  standalone: true,
  imports: [HeaderComponent,SideNavbarComponent, MatSidenavModule, MatButtonModule, MatIconModule, MatToolbarModule, MatListModule, MatCardModule, RouterModule],
  templateUrl: './app-main-view.component.html',
  styleUrl: './app-main-view.component.scss'
})
export class AppMainViewComponent {

  backButton : boolean = true;
  headerData : any = {};
  titleObj = {
    "title" : "CREATION_PORTAL"
  }

  public sidenavData: any;

  constructor(private formService:FormService) {
  }

  ngOnInit(){
    this.getnavData()
  }

  onButtonClick(buttonTitle: string) {
  }

  getnavData(){
     this.formService.getForm(SIDE_NAV_DATA).subscribe((form) =>{
      this.sidenavData = form?.result?.data?.fields?.controls
    })
  }
}
