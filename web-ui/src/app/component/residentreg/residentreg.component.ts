import { Component, OnInit } from '@angular/core';
import { ResidentregService } from './residentreg.service';
import { RequestOptions, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-residentreg',
  templateUrl: './residentreg.component.html',
  styleUrls: ['./residentreg.component.css']
})
export class ResidentregComponent implements OnInit {

  loginData: any = [];
  data: any = [];
  message: string = "";
  resp:boolean=false;
  residentreg: FormGroup
  formError: Boolean = false
  passwordMatch: Boolean = false
  constructor(private route: Router, private loader: NgxSpinnerService, private obj: FormBuilder, private residentregService: ResidentregService,
  ) {


  }

  ngOnInit() {
    this.createForm();
  }
  private createForm() {
    this.residentreg = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      first: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      // energy: new FormControl('',[Validators.required,Validators.pattern(/[0-9]+/)]),
      // cash: new FormControl('',[Validators.required,Validators.pattern(/[0-9]+/)]),
      // coin: new FormControl('',[Validators.required,Validators.pattern(/[0-9]+/)]),
      password: new FormControl('', Validators.required),
      password2: new FormControl('', Validators.required)
    });
  }
  residentRegister() {
    console.log(this.residentreg.value);
    this.loginData = [];
    this.loader.show();
    this.loginData.push(this.residentreg.value.email);
    this.loginData.push(this.residentreg.value.first);
    this.loginData.push(this.residentreg.value.lastname);
    //this.loginData.push(this.residentreg.value.energy);
    this.loginData.push("1000");
    //this.loginData.push(this.residentreg.value.cash);
    this.loginData.push("1000");
    //this.loginData.push(this.residentreg.value.coin);
    this.loginData.push("1000");
    this.loginData.push(this.residentreg.value.password);

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
    this.residentregService.submitser(args).subscribe(
      res => {

        console.log("first..");

        console.log(res);
        this.message = res['message'];
         this.resp=res['success'];
        this.loader.hide();

        console.log(this.resp)
        if(this.resp==true){
          this.route.navigate(['resident']);
        }

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
  residentlogin() {

    this.route.navigate(['home']);

  }

}
