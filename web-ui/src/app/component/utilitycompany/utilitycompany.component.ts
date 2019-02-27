import { Component, OnInit } from '@angular/core';
import { UtilitycompanyService } from './utilitycompany.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-utilitycompany',
  templateUrl: './utilitycompany.component.html',
  styleUrls: ['./utilitycompany.component.css']
})
export class UtilitycompanyComponent implements OnInit {

  constructor(private utilitycompanyService: UtilitycompanyService, private route: Router) { }
  result: Boolean = false;
  ngOnInit() {
    this.statusHouseowner()
  }

  values: Object = {};
  statusHouseowner() {

    console.log("ist"); console.log("ist"); console.log("ist");

    this.utilitycompanyService.getViewstatus().subscribe(
      res => {
        console.log("ist");
        console.log(res);
        this.values = res;
        this.result = true;
      },
      err => {
        console.log("second");
        console.log(err);

      }
    );
  }


  goToBuyCoinUtil() {
    this.route.navigate(['getcoinutil']);
  }
  goToBuyCashUtil() {
    this.route.navigate(['getcashutil']);
  }
  goToutilityhistory() {
    this.route.navigate(['energyhistorycompany']);
  }
  logout() {
    sessionStorage.clear();
    this.route.navigate(['home']);

  }
  round(number){
    return Math.round(number* 100)/100
  }


}
