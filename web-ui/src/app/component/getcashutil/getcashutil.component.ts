import { Component, OnInit } from '@angular/core';
import { GetcashutilService } from './getcashutil.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-getcashutil',
  templateUrl: './getcashutil.component.html',
  styleUrls: ['./getcashutil.component.css']
})
export class GetcashutilComponent implements OnInit {
  errorrspn: any;
  loginData: any = [];
  data: any = [];
  roleChange: string;
  values: any;
  residentreg: FormGroup
  formError: Boolean = false
  constructor(private route: Router, private loader: NgxSpinnerService, private obj: FormBuilder, private getcashutilservice: GetcashutilService,
  ) {


  }

  ngOnInit() {
    this.createForm();
    this.statusHouseowner();
  }
  private createForm() {
    this.residentreg = new FormGroup({
      bid: new FormControl('', [Validators.required, Validators.pattern(/[0-9]+/)]),

      cash: new FormControl('', [Validators.required, Validators.pattern(/[0-9]+/)])


    });
  }
  residentRegister() {

    var user = "";
    user = sessionStorage.getItem("User");

    var args = { "args": this.data }
    console.log(this.residentreg.value);
    this.loader.show();
    this.loginData = [];
    this.loginData.push(this.residentreg.value.bid);
    this.loginData.push(user);
    this.loginData.push("Get cash");
    this.loginData.push(this.residentreg.value.cash);



    var args = { "args": this.loginData };
    console.log("Array");
    console.log(args);

    this.getcashutilservice.submitser(args).subscribe(

      res => {
        this.errorrspn = "";
        console.log("first..");

        console.log(res);

        this.loader.hide();
      },

      err => {
        console.log("second");
        this.errorrspn = "";
        this.loader.hide();
        var errstring = err.error.text;
        var start = errstring.lastIndexOf("message:");
        var end = errstring.lastIndexOf(")");
        var slicestring = errstring.slice(start + 9, end);
        var errmsg = {
          error: slicestring
        }
        console.log(errmsg);
        this.errorrspn = errmsg;

      }
    );
  }
  statusHouseowner() {

    this.getcashutilservice.getViewBank().subscribe(
      res => {
        this.values = res;
        console.log(res);
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
  displayerror() {
    if (this.errorrspn) {
      return true;
    }
    else {
      return false;
    }
  }
  residenthome() {

    this.route.navigate(['utilitycompany']);

  }
}
