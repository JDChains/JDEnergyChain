import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { UtilService } from '../../util/util';
import { RequestOptions, Headers } from '@angular/http';
@Injectable({
  providedIn: 'root'
})
@Injectable({
  providedIn: 'root'
})
export class UtilitycompanyService {

  constructor(private http: HttpClient, private utilService: UtilService) {

  }
  getViewstatus() {
    var user = "";
    user = sessionStorage.getItem("User");
    var token = "";
    token = sessionStorage.getItem("token");
    return this.http.get(UtilService.url + 'get_utilitycompany_status/' + user, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    });
  }
}
