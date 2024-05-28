import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { SubTasksResourcesComponent } from '../components/sub-tasks-resources/sub-tasks-resources.component';

const routes: Routes = [
  {
    path:'',
    redirectTo:'project',
    pathMatch:'full'
  },
  {
    path:'project',
    component:LayoutComponent,
    children:[
      {
          path:'sub-tasks',
          component:SubTasksResourcesComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewModuleRoutingModule { }
