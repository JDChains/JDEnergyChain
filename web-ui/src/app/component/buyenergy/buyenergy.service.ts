import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { UtilService } from '../../util/util'
import { RequestOptions, Headers } from '@angular/http';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class BuyenergyService {

  constructor(private http: HttpClient, private utilService: UtilService, private route: Router) { }

  submitser(payload) {

    console.log(payload)

    var token = "";
    //token = UtilService.token;
    token = sessionStorage.getItem("token");
    return this.http.post(UtilService.url + 'buy_resident_to_utilitycompany', payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      });

  }

  getViewConsumer() {
    var token = "";
    token = sessionStorage.getItem("token");
    return this.http.get(UtilService.url + 'get_all_utilitycompany/' /*, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    }*/);
  }
}
