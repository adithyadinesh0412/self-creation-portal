import { Component } from '@angular/core';
import { ViewModuleModule } from 'lib-project';




@Component({
  selector: 'app-solutions-lib-holder',
  standalone: true,
  imports: [ViewModuleModule],
  templateUrl: './solutions-lib-holder.component.html',
  styleUrl: './solutions-lib-holder.component.scss'
})
export class SolutionsLibHolderComponent {

}
