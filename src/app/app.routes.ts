import { Routes } from '@angular/router';
import { CategoryComponent } from './components/category/category.component';
import { EntityComponent } from './components/entity/entity.component';
import { HomeComponent } from './components/home/home.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: ':category', component: CategoryComponent },
  { path: ':category/:entity', component: EntityComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

