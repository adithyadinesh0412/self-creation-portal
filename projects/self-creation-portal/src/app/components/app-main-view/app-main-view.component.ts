import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormService, HeaderComponent, SIDE_NAV_DATA, SideNavbarComponent } from 'lib-shared-modules';
import { CommonService } from '../../services/common-service/common.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-main-view',
  standalone: true,
  imports: [CommonModule,HeaderComponent,SideNavbarComponent, MatSidenavModule, MatButtonModule, MatIconModule, MatToolbarModule, MatListModule, MatCardModule, RouterModule],
  templateUrl: './app-main-view.component.html',
  styleUrl: './app-main-view.component.scss'
})
export class AppMainViewComponent {

  backButton : boolean = false;
  headerData : any = {
    title:"WORKSPACE"
  };
  titleObj = {
    "title" : "CREATION_PORTAL"
  }

  public sidenavData: any;
  clearQueryParamsOnNavigate: boolean = true;
  constructor(private formService:FormService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(){
    this.getnavData();
    this.getPermissions();
  }

  onButtonClick(buttonTitle: string) {
  }

  getnavData(){
     this.formService.getForm(SIDE_NAV_DATA).subscribe((form) =>{
      this.sidenavData = form?.result?.data?.fields?.controls
      let userRoles:any = localStorage.getItem('user_roles')
      userRoles = JSON.parse(userRoles);
      this.sidenavData = this.sidenavData.filter((item:any) =>
        item.roles.some((role:any) =>
            userRoles.some((innerRole:any) => innerRole.title === role)
        )
    );
    })
  }

  getPermissions() {
    this.formService.getPermissions().subscribe((res) => {})
  }

  onSideNavNavigate(item: any): void {
    if (this.clearQueryParamsOnNavigate) {
      this.clearQueryParams();
    }
    this.router.navigate([item.url], { relativeTo: this.route });
  }

  clearQueryParams() {
    this.router.navigate([], {  
      relativeTo: this.route,
      queryParams: {}
    });
  }
}
