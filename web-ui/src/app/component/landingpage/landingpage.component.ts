import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.css']
})
export class LandingpageComponent implements OnInit {

  constructor(private route: Router) { }

  ngOnInit() {
  }
  //landing to home page routing
  goToHome() {
    this.route.navigate(['home']);
  }
}
