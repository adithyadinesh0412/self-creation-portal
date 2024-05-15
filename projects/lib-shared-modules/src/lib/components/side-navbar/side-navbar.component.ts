import { Component, Input} from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list'; 
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'lib-side-navbar',
  standalone: true,
  imports: [MatSidenavModule, MatIconModule, MatListModule, MatCardModule],
  templateUrl: './side-navbar.component.html',
  styleUrl: './side-navbar.component.scss'
})
export class SideNavbarComponent {
  @Input() sidenavData : any[] = [];

}
