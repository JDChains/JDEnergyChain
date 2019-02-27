import { Component, OnInit } from '@angular/core';
import { EnergysellService } from './energysell.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-energy-sell',
  templateUrl: './energy-sell.component.html',
  styleUrls: ['./energy-sell.component.css']
})
export class EnergySellComponent implements OnInit {
  constructor(private EnergysellService: EnergysellService, private route: Router, private loader: NgxSpinnerService, private obj: FormBuilder) { }
  success: string;

  loginData: any = [];


  ngOnInit() {

  }
  resident = new FormGroup({
    Price: new FormControl(),
    TotalPower: new FormControl(),
    SDate: new FormControl(),
    EDate: new FormControl(),
    capasity: new FormControl(),
   

  });



  residenthome() {

    this.route.navigate(['residenthome']);

  }

  logout() {
    sessionStorage.clear();
    this.route.navigate(['home']);

  }
  patientUpdate() {
    var user = "";
    user = sessionStorage.getItem("User");
    this.loginData = [];
    this.loader.show();
    console.log(this.resident);
    var startDate = new Date(this.resident.value.SDate);
    var dt = startDate.getDate();
    var mn = startDate.getMonth();
    mn++;
    var yy = startDate.getFullYear();
    var sdt = dt + "/" + mn + "/" + yy;
    var endDate = new Date(this.resident.value.EDate);
    var eedt = endDate.getDate();
    var emn = endDate.getMonth();
    emn++;
    var eyy = endDate.getFullYear();
    var edt = eedt + "/" + emn + "/" + eyy;
    this.loginData.push(user);
    this.loginData.push(this.resident.value.Price);
    this.loginData.push(this.resident.value.TotalPower);
    this.loginData.push(sdt);
    this.loginData.push(edt);
    this.loginData.push(this.resident.value.capasity);
    this.loginData.push("4");

    var args = { "args": this.loginData };
    this.loginData = [];
    console.log(args);
    this.EnergysellService.submitser(args).subscribe(
      res => {

        console.log(res);
        this.success = res['resp'];
        this.loader.hide();

      },
      err => {
        console.log(err);
      }
    );

  }
  successmsg() {
    if (this.success) {
      return true;
    }
    else {
      return false;
    }
  }

  goToProfile() {
    this.route.navigate(['residentprofile']);
  }

}
