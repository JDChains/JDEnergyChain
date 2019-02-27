import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { UtilService } from '../../util/util'
import { RequestOptions, Headers } from '@angular/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BankregService {

  constructor(private http: HttpClient, private utilService: UtilService, private route: Router) { }

  submitser(payload) {

    console.log(payload)
    console.log("welome register");
    return this.http.post(UtilService.url + 'register_bank', payload)

  }
}
