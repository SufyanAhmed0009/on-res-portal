import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ServiceAuth } from '../services/auth.service';
import { StorageConstants } from '../static/storage_constants';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate,CanActivateChild{

  constructor(
    private authService : ServiceAuth,
    private router : Router
    ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
    if(!this.authService.isAuthenticated)
    {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url = childRoute.pathFromRoot
      .map(v => v.url.map(segment => segment.toString()).join('/'))
      .join('/');
    let menus: string[] = JSON.parse(localStorage.getItem(StorageConstants.ALLOWED_MENU_ROUTES));
    console.log("menus")
    console.log(menus)
    // debugger
    if (!menus.includes(url)) {
      this.router.navigate(['unauth']);
      return false; 
    }
    return true;
  }
      
}
