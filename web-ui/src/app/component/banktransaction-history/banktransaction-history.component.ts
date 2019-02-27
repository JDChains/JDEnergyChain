import { Component, OnInit } from '@angular/core';
import {BanktransationHistoryService} from './banktransation-history.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-banktransaction-history',
  templateUrl: './banktransaction-history.component.html',
  styleUrls: ['./banktransaction-history.component.css']
})
export class BanktransactionHistoryComponent implements OnInit {

  constructor(private BanktransationHistoryService:BanktransationHistoryService,private route:Router,private ActivatedRoute: ActivatedRoute) { }
values:any;


userid:any;


  ngOnInit() {

    this.ActivatedRoute.params.subscribe(params => {
      this.userid = params["id"];
     
    })
    this.gettransactionHistory();
  }
  gettransactionHistory() {
 
    console.log("ist"); console.log("ist"); console.log("ist");

    this.BanktransationHistoryService.transactionHistory(this.userid).subscribe(
      res => {
        console.log("ist");
        console.log(res);
       this.values=res;
      
      },
      err => {
        console.log("second");
        console.log(err);

      }
    );
  }

  bankhome() {

    this.route.navigate(['bank']);

  }


}
