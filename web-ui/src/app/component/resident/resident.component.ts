import { Component, OnInit } from '@angular/core';
import { ResidentService } from './resident.service';
import { RequestOptions, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-resident',
  templateUrl: './resident.component.html',
  styleUrls: ['./resident.component.css']
})
export class ResidentComponent implements OnInit {
  loginData: any = [];
  data: any = [];
  message: string = "";
  status: boolean = false;
  loginform: FormGroup
  formError: Boolean = false
  values: any;
  responsemsg: string = "";
  energyExchanged: any;
  TotalPower: any;
  Price: any;
  id: String;
  sessionStatus: boolean = false;

  rate: any;
  constructor(private route: Router, private obj: FormBuilder, private residentService: ResidentService,
  ) {


  }

  ngOnInit() {
    this.createForm()
    this.getQuotes();
    this.checkSession();

  }


  goTOResidentResister() {
    this.route.navigate(['residentreg']);
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
    this.loginData.push('Resident');
    var args = { "args": this.loginData };
    console.log("Array");
    console.log(args);
    if (this.loginform.status === "INVALID") {
      console.log('error')
      this.formError = true
      return
    }
    this.residentService.submitser(args).subscribe(
      res => {

        console.log("first..");
        console.log("first..");
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
          this.route.navigate(['residenthome']);
          // this.route.navigate(['residentprofile']);
        }
      },

      err => {
        console.log(err);

      }
    );
  }
  home() {

    this.route.navigate(['home']);

  }
  getQuotes() {

    console.log("ist"); console.log("ist"); console.log("ist");

    this.residentService.getquotes().subscribe(
      res => {
        console.log("ist");
        console.log(res);

        this.values = res;
        this.energyExchanged = res['TotalPower'];
        this.rate = res['Price'];
      },
      err => {
        console.log("second");
        console.log(err);

      }
    );
  }


  buyEnergy() {
    var token = "";
    token = sessionStorage.getItem("token");
    console.log(token);

    var user = "";
    user = sessionStorage.getItem("User");
    this.loginData = [];

    this.loginData.push(user);
    this.loginData.push("u202@email.com");
    this.loginData.push(this.TotalPower);
    this.loginData.push(this.Price);


    var args = { "args": this.loginData };
    this.loginData = [];
    console.log(args);

    if (token == null) {
      this.responsemsg = "Please login before Buy energy";
      console.log(this.responsemsg);
      //alert("Login Please");
    }
    else {

      this.residentService.submitserquotes(args).subscribe(
        res => {

          console.log(res);



        },
        err => {
          console.log(err);
        }
      );

    }
  }
  goToProfile() {
    this.route.navigate(['residentprofile']);
  }

  onSelectId(id, TotalPower, Price) {
  this.TotalPower = TotalPower;
    this.Price = Price;
    this.id = id;
    console.log(this.id);
    console.log(this.TotalPower);
    console.log(this.Price);
  }
  successmsg() {
    if (this.responsemsg) {
      return true;
    }
    else {
      return false;
    }
  }
  checkSession() {
    var token = "";
    token = sessionStorage.getItem("token");
    console.log(token);

    var user = "";
    user = sessionStorage.getItem("User");


    if (token == null) {
      this.sessionStatus = true;
    }
  }

  logout() {
    sessionStorage.clear();
    this.route.navigate(['home']);

  }
}










