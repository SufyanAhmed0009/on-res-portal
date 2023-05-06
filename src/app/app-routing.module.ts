import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { SharedUnauthPageComponent } from './shared/components/unauth-page/unauth-page.component';


const routes: Routes = [
  {
    // path: '', redirectTo: '/pos/inventory/products',
    // path: '', redirectTo: '/smarty/inventory/products',
    path: '', redirectTo: '/login',
    pathMatch: 'full'
  },
  { path: 'login', component: LoginComponent },
  { path: 'unauth', component: SharedUnauthPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
