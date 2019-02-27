import { Component, OnInit } from '@angular/core';
import { EnergyhistorycompanyService } from './energyhistorycompany.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-energyhistorycompany',
  templateUrl: './energyhistorycompany.component.html',
  styleUrls: ['./energyhistorycompany.component.css']
})
export class EnergyhistorycompanyComponent implements OnInit {
  sl:Number; 
  values:Array<Object> = [];
  constructor(private route: Router, private energyhistorycompanyService: EnergyhistorycompanyService) { }

  ngOnInit() {
    this. statusHouseowner()
    this.sl=0
  }



  statusHouseowner() {

    console.log("ist"); console.log("ist"); console.log("ist");

    this.energyhistorycompanyService.getViewstatus().subscribe(
      res => {
        console.log("ist");
        console.log(res);
        this.values = JSON.parse(JSON.stringify(res));
        this.values.reverse()
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
  utilityhome() {

    this.route.navigate(['utilitycompany']);

  }
}
