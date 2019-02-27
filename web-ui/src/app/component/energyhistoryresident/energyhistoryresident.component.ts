import { Component, OnInit } from '@angular/core';
import { EnergyhistoryresidentService } from './energyhistoryresident.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-energyhistoryresident',
  templateUrl: './energyhistoryresident.component.html',
  styleUrls: ['./energyhistoryresident.component.css']
})
export class EnergyhistoryresidentComponent implements OnInit {
  values: Array<Object> = [];
  constructor(private route: Router, private energyhistoryresidentService: EnergyhistoryresidentService) { }

  ngOnInit() {
    this.statusHouseowner()
    //setInterval(this.statusHouseowner(),5000)
  }



  statusHouseowner() {
 
    console.log("ist"); console.log("ist"); console.log("ist");

    this.energyhistoryresidentService.getViewstatus().subscribe(
      res => {
        console.log("ist");
        console.log(res);
        this.values = JSON.parse(JSON.stringify(res));
        this.values.reverse();
        console.log(this.values)
      },
      err => {
        console.log("second");
        console.log(err);

      }
    );
  }


  logout() {
    sessionStorage.clear();
    this.route.navigate(['home']);

  }
  residenthome() {

    this.route.navigate(['residenthome']);

  }
  getDate(date){
    console.log(date)
    var locale = new Date(date.substring(0,date.length-11));
    return locale.toString();
  }
  goToBuyCoin() {
    this.route.navigate(['getcoin']);
  }
  goToBuyCash() {
    this.route.navigate(['getcash']);
  }
  goToProfile(){
    this.route.navigate(['residentprofile']);
  }
}
