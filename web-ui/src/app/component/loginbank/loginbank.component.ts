import { Component, OnInit } from '@angular/core';
import { LoginbankService } from './loginbank.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-loginbank',
  templateUrl: './loginbank.component.html',
  styleUrls: ['./loginbank.component.css']
})
export class LoginbankComponent implements OnInit {

  loginData: any = [];
  data: any = [];
  message: string = "";
  status: boolean = false;
  loginform: FormGroup
  formError: Boolean = false

  constructor(private route: Router, private obj: FormBuilder, private loginbankService: LoginbankService,
  ) {


  }

  ngOnInit() {
    this.createForm()
  }


  goTOBankResister() {
    this.route.navigate(['bankreg']);
  }

  private createForm() {
    this.loginform = new FormGroup({

      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),

    });
  }

  login() {
    console.log(this.loginform.value);
    this.loginData = [];
    this.loginData.push(this.loginform.value.email);
    this.loginData.push(this.loginform.value.password);
    this.loginData.push('Bank');
    var args = { "args": this.loginData };
    console.log("Array");
    console.log(args);
    if (this.loginform.status === "INVALID") {
      console.log('error')
      this.formError = true
      return
    }
    this.loginbankService.submitser(args).subscribe(
      res => {

        console.log("first..");
        console.log(res);
        this.message = res['message'];
        status = res['success'];
        console.log("status" + this.status);
        console.log("message" + this.message);
        sessionStorage.setItem("token", (res['token']));
        sessionStorage.setItem("User", (res['User']));
        if (this.message == "Login successful") {
          console.log("Status-----------" + status);
          this.route.navigate(['bank']);
        }
      },

      err => {
        console.log("second");

      }
    );
  }
  home() {

    this.route.navigate(['home']);

  }
}
