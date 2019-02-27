import { Component, OnInit } from '@angular/core';
import { BankService } from './bank.service';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})
export class BankComponent implements OnInit {
  constructor(private bankService: BankService, private route: Router, private modalService: NgbModal) { }
  result: Boolean = false;
  id: String;
  error:boolean=false;
  ngOnInit() {
    this.getTransactions();

  }

  values:any;
  getTransactions() {

    console.log("ist"); console.log("ist"); console.log("ist");

    this.bankService.getViewstatus().subscribe(
      res => {
        console.log("ist");
        console.log(res);
        this.values = res;
        console.log( this.values);
      
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



  onSelect(){
    if(this.id){
      console.log(this.id);
      this.route.navigate(["BanktransactionHistory",this.id]);
    }
    else{
      this.error=true;
      
    }
   
  }
  onSelectId(id)
  {
    this.id=id;
  }

  residenthome() {

    this.route.navigate(['bank']);

  }
}
