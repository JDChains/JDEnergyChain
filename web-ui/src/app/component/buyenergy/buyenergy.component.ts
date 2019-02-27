import { Component, OnInit } from '@angular/core';
import { RequestOptions, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BuyenergyService } from './buyenergy.service'
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-buyenergy',
  templateUrl: './buyenergy.component.html',
  styleUrls: ['./buyenergy.component.css']
})
export class BuyenergyComponent implements OnInit {
  errorrspn: any;
  loginData: any = [];
  data: any = [];
  roleChange: string;
  values: any;
  residentreg: FormGroup
  formError: Boolean = false
  constructor(private route: Router, private loader: NgxSpinnerService, private obj: FormBuilder, private buyenergyservice: BuyenergyService,
  ) {


  }

  ngOnInit() {
    this.statusHouseowner()
    this.createForm()
  }

  private createForm() {
    this.residentreg = new FormGroup({


      cid: new FormControl('', Validators.required),

      energy: new FormControl('', [Validators.required, Validators.pattern(/[0-9]+/)]),
      rate: new FormControl('', [Validators.required, Validators.pattern(/[0-9]+/)])

    });
  }
  residentRegister() {
    var user = "";
    user = sessionStorage.getItem("User");


    var args = { "args": this.data }
    console.log(this.residentreg.value);
    this.loader.show();
    this.loginData = [];
    this.loginData.push(user);
    this.loginData.push(this.residentreg.value.cid);

    this.loginData.push(this.residentreg.value.energy);
    this.loginData.push(this.residentreg.value.rate);


    var args = { "args": this.loginData };
    console.log("Array");
    console.log(args);

    if (this.residentreg.status === "INVALID") {
      console.log('error')
      this.formError = true
      return
    }

    this.buyenergyservice.submitser(args).subscribe(
      res => {
        this.errorrspn = "";
        console.log("first..");

        console.log(res);

        this.loader.hide();
      },

      err => {
        this.errorrspn = "";
        console.log("second");
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

    this.buyenergyservice.getViewConsumer().subscribe(
      res => {
        this.values = res;
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

    this.route.navigate(['residenthome']);

  }

}
