import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ResourceHolderComponent } from './components/resource-holder/resource-holder.component';
import { AppMainViewComponent } from './components/app-main-view/app-main-view.component';
import { SolutionsLibHolderComponent } from './components/solutions-lib-holder/solutions-lib-holder.component';
import { CreateNewComponent } from './components/create-new/create-new.component';

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
                path:'create-new',
                component:CreateNewComponent
            },
            {
                path:'browse-existing',
                component:ResourceHolderComponent
            },
            {
                path:'drafts',
                component:ResourceHolderComponent
            },
            {
                path:'submit-for-review',
                component:ResourceHolderComponent
            },
            {
                path:'published',
                component:ResourceHolderComponent
            },
            {
                path:'up-for-review',
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
