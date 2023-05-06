import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauth-page',
  templateUrl: './unauth-page.component.html',
  styleUrls: ['./unauth-page.component.css']
})
export class SharedUnauthPageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    setTimeout(
      () => {
        // debugger
        this.router.navigate(['/login']);
      }, 3000
    );
  }

}
