import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { UtilService } from '../../util/util';
import { RequestOptions, Headers } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class BanktransationHistoryService {

  constructor(private http: HttpClient, private utilService: UtilService) {

  }



  transactionHistory(id) {
    console.log('ID___-'+id);
    var user = "";
    user = sessionStorage.getItem("User");
    var token = "";
    token = sessionStorage.getItem("token");
    return this.http.get(UtilService.url + 'get_user_bank_history/'+id,{
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    });
  }
}





