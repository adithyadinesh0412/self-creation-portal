import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LibSharedModulesService } from '../../lib-shared-modules.service';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-header',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, TranslateModule,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() backButton : boolean = true ;
  @Input() title!: string;
  @Input() headerData : any;
  @Output() buttonClick: EventEmitter<string> =  new EventEmitter<string>();

  constructor( private libsharedservice: LibSharedModulesService, private router: Router) {
  }

  backArrowButton() {
    this.libsharedservice.goBack()
  }

  onButtonClick(button : any) {
    this.buttonClick.emit(button.title)
  }

  logout() {
    this.libsharedservice.logout();
  }
}
