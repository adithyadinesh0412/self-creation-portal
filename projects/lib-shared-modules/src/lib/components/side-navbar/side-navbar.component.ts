import { Component, Input} from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list'; 
import { MatCardModule } from '@angular/material/card';
import { TranslateModule,TranslateService } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';

@Component({
  selector: 'lib-side-navbar',
  standalone: true,
  imports: [MatSidenavModule, MatIconModule, MatListModule, MatCardModule, TranslateModule,  RouterModule],
  templateUrl: './side-navbar.component.html',
  styleUrl: './side-navbar.component.scss'
})
export class SideNavbarComponent {
  @Input() sidenavData : any[] = [];

  constructor(private translate: TranslateService) {
    this.initializeTranslation();
  }
  
  private initializeTranslation(): void {
    this.translate.setDefaultLang('en');
  }
}
