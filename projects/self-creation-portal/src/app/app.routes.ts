import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ResourceHolderComponent } from './components/resource-holder/resource-holder.component';
import { ResoureListsComponent } from './components/resoure-lists/resoure-lists.component';
import { AppMainViewComponent } from './components/app-main-view/app-main-view.component';
import { SolutionsLibHolderComponent } from './components/solutions-lib-holder/solutions-lib-holder.component';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'home',
        pathMatch:'full'
    },
    {
        path:'home',
        component:AppMainViewComponent,
        children:[
            {
                path:'resources',
                component:ResoureListsComponent
            },
            {
                path:'browse-existing',
                component:ResourceHolderComponent
            }
            // drafts, publish and other resource listings should be added here.
        ]
    },
    {
        path:"solution",
        component:SolutionsLibHolderComponent
    }
];
