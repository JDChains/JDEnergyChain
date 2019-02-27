import { Component, OnInit } from '@angular/core';
import { ResidenthomeService } from './residenthome.service';
import { Router } from '@angular/router';

interface History {
  value: Value
  timestamp: string;
}
interface Value{
  CoinCredit: number;
  CoinDebit: number;
}

@Component({
  selector: 'app-residenthome',
  templateUrl: './residenthome.component.html',
  styleUrls: ['./residenthome.component.css']
})

export class ResidenthomeComponent implements OnInit {
  
  url:String;
  doughnutChartData:number[];
  CoinCredit:number[];
  CoinDebit:number[];
  monthSell:number=0;
  monthBuy:number=0;
  statistics:Object={};
  energy:object={};
  constructor(private residenthomeservice: ResidenthomeService, private route: Router) { }
  result: Boolean = false;
  gotHistory: Boolean = false;
  ngOnInit() {
    this.statusView();
       this.getStatistics();
  }
  values: Object = {};
  history: Array<History> =[];

 // lineChart
 public lineChartData:Array<any> = [[], []];
 public lineChartLabels:Array<any> = []=[];
  public doughnutChartLabels:string[] = ['energy value', 'coin balance', 'cash value'];
  public doughnutChartDataValue:number[]=[];
  public doughnutChartType:string = 'doughnut';

  //barchart 
  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  
  
  public barChartLabels:string[] = [];
  public barChartData:any[] =[
    {data: [], label: ''},
    {data: [], label: ''}
  ];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;

  public arrayOne:number[] = [];
  public arrayTwo:number[] = [];

  // events

  //-------------------------------------------------------------------
  statusView() {
    console.log("1111111111111111111111111111111111111111111111111111111111111111111111111111");
    this.residenthomeservice.getViewstatus().subscribe(
      res => {
        console.log("ist");
        console.log("AAAAAAAAAAAAAAAAAAAAAAAA");
        console.log(res);
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAA");
        //console.log(res['ENERGY.EnergyValue']);
       this.values = res;
      this.doughnutChartData = [JSON.parse(JSON.stringify(res)).ENERGY.EnergyValue,JSON.parse(JSON.stringify(res)).COIN.CoinBalance,JSON.parse(JSON.stringify(res)).BANKACCOUNT.CashValue];
       this.doughnutChartData=[100,500,400];
       this.doughnutChartDataValue=[100,500,400];
       console.log("CCCCCCCCCCCCCCCCCCCCC");
       console.log(this.doughnutChartDataValue);
       console.log("CCCCCCCCCCCCCCCCCCCCCCCCCC");
       console.log("my data my data");
        this.result = true;
        this.url="http://192.168.0.104:3001/";
        console.log("1111111111111111111111111111111111111111111111111111111111111111111111111111");
      },
      err => {
        console.log("second");
        console.log(err);

      }
    );
  }


  goToSellEnergy() {
    this.route.navigate(['sellenergy']);
  }

  goToBuyEnergy() {
    this.route.navigate(['buyenergy']);
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

  logout() {
    sessionStorage.clear();
    this.route.navigate(['home']);

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
  getStatistics(){
    this.residenthomeservice.getHistory().subscribe(
      res=>{
        console.log("BBBBBBBBBBBBBBBBBBBBBBBBBB");
        console.log(res);
        console.log("BBBBBBBBBBBBBBBBBBBBBBBBBB");
        this.history=JSON.parse(JSON.stringify(res))
        this.gotHistory=true
        console.log("DDDDDDDDDDDDDDDDDDDD");
        console.log(this.history)
        console.log("DDDDDDDDDDDDDDDDDDDD");
        var currentDate='nil'
        var coinCredit=0
        var coinDebit=0  
        var month='nil';
          
        this.history.forEach((data)=>{
            if(currentDate!==this.getDay(data.timestamp)&&this.getDay(data.timestamp)!=='NaN/NaN/NaN'){
              currentDate=this.getDay(data.timestamp)
              this.barChartLabels.push(currentDate)
              this.arrayOne.push(0)
              this.arrayTwo.push(0)
            }else{
              coinCredit=this.arrayOne.pop()
              coinDebit=this.arrayTwo.pop()
              this.arrayOne.push(coinCredit+data.value.CoinCredit)
              this.arrayTwo.push(coinDebit+data.value.CoinDebit)
            } 
            if(month!==this.getMonth(data.timestamp)&&this.getMonth(data.timestamp)=='NaN'){
              month=this.getMonth(data.timestamp)
              this.monthBuy=0;
              this.monthSell=0
            }else{
              this.monthBuy=this.monthBuy+data.value.CoinDebit;
              this.monthSell=this.monthSell+data.value.CoinCredit;
            }
            
        }
        
        )
        console.log(month)
        this.barChartData =[
          {data: this.arrayOne, label: 'Sell energy'},
          {data: this.arrayTwo, label: 'Buy energy'} 
        ];
        console.log(this.arrayOne)
        console.log(this.arrayTwo)
        console.log(this.barChartData)
        console.log('monthly buy : '+this.monthBuy)
        console.log('mont sell'+this.monthSell)
        // this.CoinCredit=[res.value.CoinCredit];
        //this.CoinDebit=[res.value.CoinDebit];
        //this.lineChartData=[[ this.CoinCredit],[this.CoinDebit]]
        //console.log(this.lineChartData);
      },err=>{
        console.log("some error occoured")
      } 
    )
  }


  
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }

 
  public lineChartType:string = 'bar';
  
  public chartClicked2(e:any):void {
    console.log(e);
  }
 
  public chartHovered2(e:any):void {
    console.log(e);
  }

}

