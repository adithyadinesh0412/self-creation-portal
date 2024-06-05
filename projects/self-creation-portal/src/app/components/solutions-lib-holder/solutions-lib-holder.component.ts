import { Component } from '@angular/core';
import { ViewModuleModule } from 'lib-project';

import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-solutions-lib-holder',
  standalone: true,
  imports: [ViewModuleModule,RouterModule],
  templateUrl: './solutions-lib-holder.component.html',
  styleUrl: './solutions-lib-holder.component.scss'
})
export class SolutionsLibHolderComponent {

}
