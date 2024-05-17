import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

export const routes: Routes = [{
    path: '',
    loadComponent: () => import('./app.component').then(module => module.AppComponent)
}, {
    path: 'face',
    loadComponent: () => import('./components/random-face/random-face.component').then(module => module.RandomFaceComponent)
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }