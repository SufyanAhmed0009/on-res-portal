import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppConstants } from 'src/app/core/static/app-constants';
import { DtLanguage, RespLanguage } from 'src/app/core/models/language';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { ReqLogin, RespLogin } from 'src/app/core/models/login';
import { ServiceMenu } from 'src/app/core/services/menu.service';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';
import { RespMenu } from 'src/app/core/models/menu';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted: boolean;
  languages: DtLanguage[];
  langDir: string;
  error: string;

  constructor(
    private authService: ServiceAuth,
    private router: Router,
    private languageService: ServiceLanguage,
    private menuService: ServiceMenu,
    private snackBarService: ServiceSnackbar,
  ) {
    if (this.authService.isAuthenticated()) {
      // this.router.navigate(["/pos/orders/manage"]);
      this.router.navigate(["/smarty/orders/manage"]);
    }
  }

  ngOnInit(): void {
    this.initializeLanguages();
    this.loginForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    });
  }

  login() {
    this.submitted = true;
    let request: ReqLogin = new ReqLogin();
    request.user = {
      username: this.loginForm.controls.username.value,
      password: this.loginForm.controls.password.value
    }
    request.portalType = AppConstants.PORTAL_TYPE;
  
    this.authService.login(request).subscribe(
      (response: RespLogin) => {
        console.log(response);
        // if (response.userType != 'OWNER'){
        // let temp=  response.userTypeList.find(x => x==22);

        let temp = response.userTypeList;
        console.log(temp );

        // if (temp == null) {
        // console.log(temp+" MMMMMMMMMMMMMMMMMMMMMMM");
        // if (temp==null){
        //   this.onError();
        // }
        if (!response.userTypeList.includes(24) && !response.userTypeList.includes(25)) {
          console.log('if data')
          // this.onError();
          this.error = "Permission Denied!"
        }
        else if (response.branchList) {
          console.log('else if data')
          this.authService.setToken(response.tokenString);
          this.authService.setRestuarantList(response.userRestaurants);
          this.authService.setRefreshToken(response.refreshTokenString);
          this.authService.setUserId(response.userId);
          this.authService.setUsername(response.fullUsername);
          this.authService.setUserType(response.userType);
          this.authService.setFranchiseId(response.hqId);
          this.authService.setFullName(response.name);
          // this.authService.setBranchId(response.branchList[0].id);
          // this.authService.setBranchesList(response.branchList);
          // this.authService.setBranchName(response.branchList[0].title);
          this.authService.setUserTypeList(response.userTypeList);
          this.authService.setUserRestaurantList(response.userRestaurants);

          this.menuService.getNavigationMenus().subscribe(
            (data: RespMenu[]) => {
              console.log("login")     
              data = data.filter(item => item.menu.portalType == 'r');
              console.log(data)
              console.log(data)
              this.menuService.setAllowedRoutes(data);
              this.menuService.setNavigationMenus(data);

              //Displaying Success Message.
              this.snackBarService.showSuccessMessage("Login Successful");
// debugger
              let userType = this.authService.getUserType();
              // this.router.navigateByUrl("/pos/orders/manage");
              this.router.navigateByUrl("/smarty/orders/manage");
            }
          );
        }
        else {
          this.onError();
        }
        this.submitted = false;
      },
      (error) => {
        this.submitted = false;
        this.onError();
      }
      //}
    );
  }

  onError() {
    this.error = "Invalid credentials. Try Again."
  }

  initializeLanguages() {
    this.languages = this.languageService.getLanguagesList();
    let currentLanguage = this.languageService.getCurrentLanguage();
    if (currentLanguage == null) {
      this.languageService.setCurrentLanguage(this.languages[0]);
      this.langDir = 'ltr';
    } else {
      this.langDir = currentLanguage.dir;
    }
  }

  getVersion() {
    return AppConstants.VERSION;
  }

  onChangeLanguage(language: DtLanguage) {
    console.log(language);
    this.languageService.setCurrentLanguage(language);
    this.langDir = language.dir;
    console.log(this.langDir);
  }
}