import { Component, OnInit } from '@angular/core';
import { CompanyregService } from './companyreg.service';

import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-companyreg',
  templateUrl: './companyreg.component.html',
  styleUrls: ['./companyreg.component.css']
})
export class CompanyregComponent implements OnInit {

  loginData: any = [];
  data: any = [];
  message: string = "";
  residentreg: FormGroup
  formError: Boolean = false
  passwordMatch: Boolean = false

  constructor(private route: Router, private loader: NgxSpinnerService, private obj: FormBuilder, private companyregService: CompanyregService,
  ) {


  }

  ngOnInit() {
    this.createForm();
  }
  private createForm() {
    this.residentreg = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      name: new FormControl('', Validators.required),
      energy: new FormControl('', [Validators.required, Validators.pattern(/[0-9]+/)]),
      coin: new FormControl('', [Validators.required, Validators.pattern(/[0-9]+/)]),
      cash: new FormControl('', [Validators.required, Validators.pattern(/[0-9]+/)]),
      password: new FormControl('', Validators.required),
      password2: new FormControl('', Validators.required),
    });
  }
  residentRegister() {
    console.log(this.residentreg.value);
    this.loginData = [];
    this.loader.show();
    this.loginData.push(this.residentreg.value.email);
    this.loginData.push(this.residentreg.value.name);
    this.loginData.push(this.residentreg.value.energy);
    this.loginData.push(this.residentreg.value.coin);
    this.loginData.push(this.residentreg.value.password);
    this.loginData.push(this.residentreg.value.cash);
    var args = { "args": this.loginData };
    console.log("Array");
    console.log(args);

    if (this.residentreg.value.password2 === this.residentreg.value.password) {
      this.passwordMatch = true;
    }
    if (this.residentreg.status === "INVALID" || !this.passwordMatch) {
      console.log('error')
      this.formError = true
      return
    }


    this.companyregService.submitser(args).subscribe(
      res => {

        console.log("first..");

        console.log(res);
        this.message = res['message'];
        this.loader.hide();
      },

      err => {
        console.log("second");
        this.loader.hide();
      }
    );
  }
  msg() {


    if (this.message) {
      return true;
    }
    else {
      return false;
    }

  }

}
