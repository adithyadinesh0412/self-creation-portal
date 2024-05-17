import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LibSharedModulesService } from '../../lib-shared-modules.service';
import { TranslateModule,TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'lib-header',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() backButton : boolean = true ;
  @Input() title!: string;
  @Input() headerData : any;
  @Output() buttonClick: EventEmitter<string> =  new EventEmitter<string>();

  constructor( private libsharedservice: LibSharedModulesService, private translate: TranslateService) {
    this.initializeTranslation();
  }
  
  private initializeTranslation(): void {
    this.translate.setDefaultLang('en');
  }
  
  
  backArrowButton() {
    this.libsharedservice.goBack()
  }

  onButtonClick(button : any) {
    this.buttonClick.emit(button.title)
  }
  
}
