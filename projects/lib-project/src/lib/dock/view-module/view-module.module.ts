import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewModuleRoutingModule } from './view-module-routing.module';
import { CommentsBoxComponent, HeaderComponent, SideNavbarComponent, PreviewComponent } from 'lib-shared-modules';
import { LayoutComponent } from './layout/layout.component';
import { TasksComponent } from '../components/tasks/tasks.component';


@NgModule({
  declarations: [LayoutComponent],
  imports: [
    CommonModule,
    ViewModuleRoutingModule,
    HeaderComponent,
    SideNavbarComponent,
    TasksComponent,
    CommentsBoxComponent,
    PreviewComponent
  ],
  exports:[LayoutComponent]
})
export class ViewModuleModule { }
