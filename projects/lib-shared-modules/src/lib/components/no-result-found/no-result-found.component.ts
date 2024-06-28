import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'lib-no-result-found',
  standalone: true,
  imports: [ TranslateModule, MatIconModule],
  templateUrl: './no-result-found.component.html',
  styleUrl: './no-result-found.component.scss'
})
export class NoResultFoundComponent {
  @Input() imagePath!: string;
  @Input() noResultMessage!: string;

  getImageUrl(): string {
    return this.imagePath
  }
}
