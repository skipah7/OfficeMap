import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './auth/guards/admin.guard';
import { AuthGuard } from './auth/guards/auth.guard';

const routes: Routes = [{
  path: '',
  canActivate: [AuthGuard],
  children: [{
    path: '',
    loadChildren: () => import('./main/main.module').then((module) => module.MainModule),
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then((module) => module.AdminModule),
    canLoad: [AdminGuard],
  }]
},
{
  path: 'login',
  loadChildren: () => import('./auth/auth.module').then((module) => module.AuthModule),
},

// redirect to main in case of other routes
{
  path: '**',
  redirectTo: '',
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, AdminGuard],
})
export class AppRoutingModule { }
