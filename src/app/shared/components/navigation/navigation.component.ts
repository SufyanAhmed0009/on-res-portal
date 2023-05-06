import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { ServiceMenu } from 'src/app/core/services/menu.service';
import { DtLanguage, RespLanguage, Restaurant } from 'src/app/core/models/language';
import { DtListSubMenu, DtListMenu } from 'src/app/core/models/menu';
import { Servers, AppConstants } from 'src/app/core/static/app-constants';
import { map, shareReplay } from 'rxjs/operators';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { MenuConstants } from 'src/app/core/static/menu_constants';
import { DtSelectItem } from 'src/app/core/models/select';


@Component({
  selector: 'pos-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  /* OBSERVABLE FOR SWITCHING TO HANDSET MODE. */
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  /* COLORS */
  colors: {
    TITLE_BAR: string,
    MENU_BAR: string
  }

  menus: DtListMenu[] = [];
  submenus: DtListSubMenu[] = [];

  panelTitle: string;
  currentUser: string;

  /* FOR LANGUAGES */
  currentLanguage: DtLanguage;
  currentLanguageTitle: string;
  languages: DtLanguage[];

  currentRestaurant: Restaurant;
  currentRestaurantTitle: string;
  restuarant: Restaurant[];

  /* TESTING MODE */
  testMode: boolean;

  /* STORES (BRANCHES) */
  stores: DtSelectItem[];
  currentStoreId: number;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private languageService: ServiceLanguage,
    private menuService: ServiceMenu,
    private authService: ServiceAuth,
    private router: Router,
  ) { }

  ngOnInit() {
    
    this.testMode = Servers.TEST_MODE;
    this.colors = AppConstants.COLORS;
    // this.menus = MenuConstants.MENU_LIST;
    this.menus = this.menuService.getMenusFromLocalStorage();
    console.log("this.menus")
    console.log(this.menus)
    this.initilizeRestaurant();
    this.initializeLanguages();
    this.currentStoreId = this.authService.getBranchId();
    this.stores = this.authService.getBranchesList();
    // this.panelTitle = this.authService.getBranchName();
    this.panelTitle = "Restaurant Portal";
    this.currentUser = this.authService.getUsername();
  }

  initilizeRestaurant() {
    console.log(this.authService.getRestuarantList());
    this.languageService.getRestaurantTitleFromIds(this.authService.getRestuarantList()).subscribe(
      (data: Restaurant[]) => {
        this.restuarant = data;
        this.currentRestaurant = this.restuarant[0];
        this.authService.setRestaurantId(this.currentRestaurant.id);
        this.authService.setRestaurantName(this.currentRestaurant.title);
        this.authService.restaurantChanged.emit(this.currentRestaurant);
        this.currentRestaurantTitle = this.currentRestaurant.title;
        console.log(this.currentRestaurantTitle);
      }
    );

  }
  onRestaurantChange() {
    console.log(this.currentRestaurantTitle);
    this.restuarant.forEach(
      (restuarant) => {
        if (restuarant.title == this.currentRestaurantTitle) {
          console.log(restuarant);
          this.authService.setRestaurantId(restuarant.id);
          this.authService.setRestaurantName(restuarant.title);
          this.currentRestaurant = restuarant;
          this.currentRestaurantTitle = this.currentRestaurant.title;
          this.authService.restaurantChanged.emit(restuarant);
        }
      }
    )

  }
  initializeLanguages() {

    if (!this.languageService.languagesFetched()) {
      this.languageService.getLanguagesListFromServer().subscribe(
        (data: RespLanguage) => {
          this.languages = data.languages.map(
            (language) => {
              return {
                id: language.id,
                name: language.title,
                flagClass: language.imageClass,
                dir: language.langDir
              }
            }
          );
          this.languageService.setLanguagesList(this.languages);
          this.languageService.setCurrentLanguage(this.languages[0]);
          this.currentLanguage = this.languageService.getCurrentLanguage();
          this.currentLanguageTitle = this.currentLanguage.name;
        }
      );
    } else {
      this.languages = this.languageService.getLanguagesList();
      this.currentLanguage = this.languageService.getCurrentLanguage();
      this.currentLanguageTitle = this.languageService.getCurrentLanguage().name;
    }

  }

  setSubmenu(list: DtListSubMenu[]) {
    this.submenus = list;
  }

  onLanguageChange() {
    this.languages.forEach(
      (language) => {
        if (language.name == this.currentLanguageTitle) {
          this.currentLanguage = language;
        }
      }
    );
    this.languageService.setCurrentLanguage(this.currentLanguage);
    this.languageService.languageChangedEmittor.emit(this.currentLanguage);
  }

  onStoreChange() {
    this.stores.forEach(
      (store) => {
        if (store.id == this.currentStoreId) {
          this.authService.setBranchId(store.id);
          this.authService.setBranchName(store.title);
          this.authService.storeChanged.emit(store);
          this.panelTitle = store.title;
        }
      }
    )
  }

  onRoute(link: string) {
    // this.router.navigate(['pos/' + link]);
    this.router.navigate(['smarty/' + link]);
  }
  
  onSettingsClicked(){
    console.log("here");
    // this.router.navigateByUrl("/pos/settings");
    this.router.navigateByUrl("/smarty/settings");
  }
  /* FOR LOGOUT */
  onLogout() {
    // this.database.object('/logout/-Lzkkaq5B2IDMc_U59by').set({
    //   status: 'USER',
    //   id: this.authService.getUserId()
    // });
    this.authService.logout();
  }

  getVersion() {
    return AppConstants.VERSION;
  }

}
