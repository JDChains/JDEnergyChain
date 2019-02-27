import { Component, OnInit } from '@angular/core';
import { GetcoinutilService } from './getcoinutil.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-getcoinutil',
  templateUrl: './getcoinutil.component.html',
  styleUrls: ['./getcoinutil.component.css']
})
export class GetcoinutilComponent implements OnInit {
  loginData: any = [];
  data: any = [];
  roleChange: string;
  values: any;
  residentreg: FormGroup
  formError: Boolean = false
  errorrspn: any;
  constructor(private route: Router, private loader: NgxSpinnerService, private obj: FormBuilder, private getcoinutilservice: GetcoinutilService,
  ) {


  }

  ngOnInit() {
    this.statusHouseowner();
    this.createForm();
  }
  private createForm() {
    this.residentreg = new FormGroup({

      bid: new FormControl('', [Validators.required]),

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
    this.loginData.push("Get coin");
    this.loginData.push(this.residentreg.value.cash);



    var args = { "args": this.loginData };
    console.log("Array");
    console.log(args);

    if (this.residentreg.status === "INVALID") {
      console.log('error')
      this.formError = true
      return
    }

    this.getcoinutilservice.submitser(args).subscribe(
      res => {
        this.errorrspn = "";
        console.log("first..");

        console.log(res);
        this.loader.hide();

      },

      err => {
        this.errorrspn = "";
        this.loader.hide();
        console.log("second");
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

    this.getcoinutilservice.getViewBank().subscribe(
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
  residenthome() {

    this.route.navigate(['utilitycompany']);

  }


  displayerror() {
    if (this.errorrspn) {
      return true;
    }
    else {
      return false;
    }
  }


}
