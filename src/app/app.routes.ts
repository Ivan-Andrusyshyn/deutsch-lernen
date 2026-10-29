import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/learning/pages/learning-page/learning-page.component').then(
        (component) => component.LearningPageComponent,
      ),
  },
];
