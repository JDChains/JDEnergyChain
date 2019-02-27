import { Component, OnInit } from '@angular/core';
import { BankregService } from './bankreg.service';
import { RequestOptions, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-bankreg',
  templateUrl: './bankreg.component.html',
  styleUrls: ['./bankreg.component.css']
})
export class BankregComponent implements OnInit {
  loginData: any = [];
  data: any = [];
  message: string = "";
  residentreg: FormGroup
  formError: Boolean = false
  passwordMatch: Boolean = false
  constructor(private route: Router, private loader: NgxSpinnerService, private obj: FormBuilder, private bankregService: BankregService,
  ) { }

  ngOnInit() {
    this.createForm();
  }
  private createForm() {
    this.residentreg = new FormGroup({

      email: new FormControl('', [Validators.required, Validators.email]),

      name: new FormControl('', Validators.required),
     // cash: new FormControl('', [Validators.required, Validators.pattern(/[0-9]+/)]),
     // coin: new FormControl('', [Validators.required, Validators.pattern(/[0-9]+/)]),
      password: new FormControl('', Validators.required),
      password2: new FormControl('', Validators.required)

    });
  }
  residentRegister() {


    this.passwordMatch = false;
    this.loginData = [];
    this.loader.show();
    this.loginData.push(this.residentreg.value.email);
    this.loginData.push(this.residentreg.value.name);
   // this.loginData.push(this.residentreg.value.coin);
   // this.loginData.push(this.residentreg.value.cash);
    this.loginData.push(this.residentreg.value.password);

    var args = { "args": this.loginData };

    if (this.residentreg.value.password2 === this.residentreg.value.password) {
      this.passwordMatch = true;
    }
    if (this.residentreg.status === "INVALID" || !this.passwordMatch) {
      console.log('error')
      this.formError = true
      return
    }

    this.bankregService.submitser(args).subscribe(
      res => {

        console.log("User Added");

        console.log(res);
        this.loader.hide();
        this.message = res['message'];


      },

      err => {
        console.log("Some error occoured");
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


  home() {

    this.route.navigate(['home']);

  }
}
