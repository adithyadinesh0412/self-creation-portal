import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() backButton : boolean = true

  constructor(private router : Router) {}

  backArrowButton() {
    this.router.navigate(['']);
    console.log('onclickbackbutton')
  }
}
