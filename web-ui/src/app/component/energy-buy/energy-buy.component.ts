import { Component, OnInit } from '@angular/core';
import {EnergybuyService} from './energybuy.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-energy-buy',
  templateUrl: './energy-buy.component.html',
  styleUrls: ['./energy-buy.component.css']
})
export class EnergyBuyComponent implements OnInit {

 constructor(private EnergybuyService: EnergybuyService , private route:Router,private loader: NgxSpinnerService,) { }
values:any;
energyExchanged:any;
loginData:any;
success:string;
id: String;

TotalPower:any;
Price:any;
rate:any;
  ngOnInit() {
    this.getQuotes()
  }

 residenthome() {
    this.route.navigate(['residenthome']);
  }


  getQuotes() {
 
    console.log("ist"); console.log("ist"); console.log("ist");

    this.EnergybuyService.getquotes().subscribe(
      res => {
        console.log("ist");
        console.log(res);
       this.values=res;
       this.energyExchanged=res['TotalPower'];
       this.rate=res['Price'];
      },
      err => {
        console.log("second");
        console.log(err);

      }
    );
  }



   buyEnergy() {
    var user = "";
    user = sessionStorage.getItem("User");
    this.loginData = [];
    this.loader.show();
    this.loginData.push(user);
    this.loginData.push("u202@email.com");
    this.loginData.push(this.TotalPower);
    this.loginData.push( this.Price);
    var args = { "args": this.loginData };
    this.loginData = [];
    console.log(args);
    this.EnergybuyService.submitser(args).subscribe(
      res => {
      
        console.log(res);
        this. success=res['resp'];
  
        this.loader.hide();
       
      },
      err => {
        console.log(err);
        this.loader.hide();
      }
    );
     
  }
  goToProfile(){
    this.route.navigate(['residentprofile']);
  }

  onSelectId(id,TotalPower,Price)
  {  this.TotalPower=TotalPower;
    this.Price=Price;
    this.id=id;
    console.log(this.id);
    console.log(this.TotalPower);
    console.log(this.Price);
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

}
