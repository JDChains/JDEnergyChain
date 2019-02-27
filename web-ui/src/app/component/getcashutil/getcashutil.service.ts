import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { UtilService } from '../../util/util'
import { RequestOptions, Headers } from '@angular/http';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class GetcashutilService {

  constructor(private http: HttpClient, private utilService: UtilService, private route: Router) { }

  submitser(payload) {

    console.log(payload)

    var token = "";
    //token = UtilService.token;
    token = sessionStorage.getItem("token");
    return this.http.post(UtilService.url + 'utilitycompany_to_bank', payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      });
  }


  getViewBank() {
    var token = "";
    token = sessionStorage.getItem("token");
    return this.http.get(UtilService.url + 'get_all_bank', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    });
  }

}
