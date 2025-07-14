import { Routes } from '@angular/router';

import { EstudianteFormComponent } from './feature/estudiante/estudiante-form/estudiante-form.component';
import { EstudianteListComponent } from './feature/estudiante/estudiante-list/estudiante-list.component';

export const routes: Routes = [

    { path: 'estudiante-form', component: EstudianteFormComponent },
    { path: 'estudiante-list', component: EstudianteListComponent },

    // Default route
    { path: '', 
    pathMatch: 'full', 
    redirectTo: 'estudiante-form' }
];
