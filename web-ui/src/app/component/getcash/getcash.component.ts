import { Component, OnInit } from '@angular/core';
import { GetcashService } from './getcash.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-getcash',
  templateUrl: './getcash.component.html',
  styleUrls: ['./getcash.component.css']
})
export class GetcashComponent implements OnInit {
  errorrspn: any;
  loginData: any = [];
  data: any = [];
  roleChange: string;
  values: any;
  residentreg: FormGroup
  formError: Boolean = false;
  success:string;
  constructor(private route: Router, private loader: NgxSpinnerService, private obj: FormBuilder, private getcashService: GetcashService,
  ) {


  }



  ngOnInit() {
    this.createForm();
   // this.statusHouseowner();
  }
  private createForm() {
    this.residentreg = new FormGroup({

      // bid: new FormControl('',[Validators.required]),

      cash: new FormControl('', [Validators.required, Validators.pattern(/[0-9]+/)])


    });
  }
  residentRegister() {

    var user = "";
    user = sessionStorage.getItem("User");

    var args = { "args": this.data }
    console.log(this.residentreg.value);
    this.loginData = [];
    this.loader.show();
    // this.loginData.push(this.residentreg.value.bid);
    this.loginData.push(user);
    this.loginData.push("u202@email.com");
  
    this.loginData.push("Get Cash");
    this.loginData.push(this.residentreg.value.cash);



    var args = { "args": this.loginData };
    console.log("Array");
    console.log(args);
    if (this.residentreg.status === "INVALID") {
      console.log('error')
      this.formError = true
      return
    }
    this.getcashService.submitser(args).subscribe(
      res => {
        this.errorrspn = "";
        console.log("first..");

        console.log(res);
        this. success=res['resp'];
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

    this.getcashService.getViewBank().subscribe(
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

    this.route.navigate(['residenthome']);

  }
  successmsg()
  {
    if(this. success){
        return true;
    }
    else{
      return false;
    }
  }
  goToBuyCoin() {
    this.route.navigate(['getcoin']);
  }
  goToBuyCash() {
    this.route.navigate(['getcash']);
  }
  goToProfile(){
    this.route.navigate(['residentprofile']);
  }
  goToResidentHistory() {
    this.route.navigate(['energyhistoryresident']);
  }
}
