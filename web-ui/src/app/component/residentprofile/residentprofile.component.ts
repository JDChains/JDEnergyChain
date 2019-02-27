import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {ResidentprofileService} from './residentprofile.service';
import { analyzeAndValidateNgModules } from '@angular/compiler';

interface History {
  value: Value
  timestamp: string;
}
interface Value{
  CoinCredit: number;
  CoinDebit: number;
}

@Component({
  selector: 'app-residentprofile',
  templateUrl: './residentprofile.component.html',
  styleUrls: ['./residentprofile.component.css']
})
export class ResidentprofileComponent implements OnInit {
  
  constructor(private route: Router,private ResidentprofileService: ResidentprofileService) { }
  values: Object = {};
  firstname:any;
  address:any;
  
  history: Array<History> =[];
  monthSell:number=0;
  monthBuy:number=0;
  ngOnInit() {
  
this.statusView();
this. getStatistics();
  }

  statusView() {
    console.log("1111111111111111111111111111111111111111111111111111111111111111111111111111");
    this.ResidentprofileService.getViewstatus().subscribe(
      res => {
        console.log("ist");
        console.log("AAAAAAAAAAAAAAAAAAAAAAAA");
        console.log(res);
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAA");
        //console.log(res['ENERGY.EnergyValue']);
       this.values = res;
       console.log(res);
       this.firstname=res['FirstName'];
       this.address=res['LastName'];
       //this.coinbalence=res['COIN.CoinBalance'];
      
      },
      err => {
        console.log("second");
        console.log(err);

      }
    );
  }

  getStatistics(){
    this.ResidentprofileService.getHistory().subscribe(
      res=>{
        console.log("assssssssssssssssssssssss");
       
          console.log(res);
     
       this.history=JSON.parse(JSON.stringify(res))
       console.log("assssssssssssssssssssssss");
       console.log("assssssssssssssssssssssss");
     
       console.log("assssssssssssssssssssssss");
       var currentDate='nil'
       var coinCredit=0
       var coinDebit=0  
       var month='nil';

       this.history.forEach((data)=>{
        if(month!==this.getMonth(data.timestamp)&&this.getMonth(data.timestamp)=='NaN'){
          month=this.getMonth(data.timestamp)
          this.monthBuy=0;
          this.monthSell=0
        }else{
          this.monthBuy=this.monthBuy+data.value.CoinDebit;
          this.monthSell=this.monthSell+data.value.CoinCredit;
        }
    })
      },err=>{
        console.log("some error occoured")
      } 
    )
  }

  round(number){
    return Math.round(number* 100)/100
  }
  getDay(date){

    var locale = new Date(date.substring(0,date.length-11));
    return locale.getDate().toString()+'/'+(locale.getMonth()+1).toString()+'/'+locale.getFullYear().toString();
  }
  getMonth(date){

    var locale = new Date(date.substring(0,date.length-11));
    return(date.substring(5,7))
  }
  getMonthName(){
    const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
    return monthNames[new Date().getMonth()]

  }



  goToSellEnergy() {
    this.route.navigate(['energysell']);
  }

  goToBuyEnergy() {
    this.route.navigate(['buy_energy_public']);
  }
  goToBuyCoin() {
    this.route.navigate(['getcoin']);
  }
  goToBuyCash() {
    this.route.navigate(['getcash']);
  }

  goToResidentHistory() {
    this.route.navigate(['energyhistoryresident']);
  }
  residenthome() {

    this.route.navigate(['residenthome']);

  }
}
