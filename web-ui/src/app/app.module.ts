import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './app.routing';
import { AppComponent } from './app.component';
import { HomeComponent } from './component/home/home.component';
import { LandingpageComponent } from './component/landingpage/landingpage.component';
import { ResidentComponent } from './component/resident/resident.component';
import { BankComponent } from './component/bank/bank.component';
import { UtilitycompanyComponent } from './component/utilitycompany/utilitycompany.component';
import { ResidentService } from './component/resident/resident.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UtilService } from './util/util';
import { ResidentregComponent } from './component/residentreg/residentreg.component';
import { ResidentregService } from './component/residentreg/residentreg.service';
import { ResidenthomeComponent } from './component/residenthome/residenthome.component';
import { ResidenthomeService } from './component/residenthome/residenthome.service';
import { SellenergyComponent } from './component/sellenergy/sellenergy.component';
import { SellenergyService } from './component/sellenergy/sellenergy.service';
import { BuyenergyComponent } from './component/buyenergy/buyenergy.component';
import { BuyenergyService } from './component/buyenergy/buyenergy.service';
import { GetcoinComponent } from './component/getcoin/getcoin.component';
import { GetcoinService } from './component/getcoin/getcoin.service';
import { GetcashComponent } from './component/getcash/getcash.component';
import { GetcashService } from './component/getcash/getcash.service';
import { LoginbankComponent } from './component/loginbank/loginbank.component';
import { LoginbankService } from './component/loginbank/loginbank.service';
import { BankregComponent } from './component/bankreg/bankreg.component';
import { BankregService } from './component/bankreg/bankreg.service';
import { LogincompanyComponent } from './component/logincompany/logincompany.component';
import { LogincompanyService } from './component/logincompany/logincompany.service';
import { CompanyregComponent } from './component/companyreg/companyreg.component';
import { UtilitycompanyService } from './component/utilitycompany/utilitycompany.service';
import { GetcoinutilComponent } from './component/getcoinutil/getcoinutil.component';
import { GetcashutilComponent } from './component/getcashutil/getcashutil.component';
import { BankService } from './component/bank/bank.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { EnergyhistoryresidentComponent } from './component/energyhistoryresident/energyhistoryresident.component';
import { EnergyhistoryresidentService } from './component/energyhistoryresident/energyhistoryresident.service';
import { EnergyhistorycompanyComponent } from './component/energyhistorycompany/energyhistorycompany.component';
import { EnergyhistorycompanyService } from './component/energyhistorycompany/energyhistorycompany.service';
import { TestComponent } from './component/test/test.component';
import { ChartsModule } from 'ng2-charts';
import { ResidentprofileComponent } from './component/residentprofile/residentprofile.component';
import {ResidentprofileService} from './component/residentprofile/residentprofile.service';
import { EnergyBuyComponent } from './component/energy-buy/energy-buy.component';
import { EnergySellComponent } from './component/energy-sell/energy-sell.component';
import {EnergysellService} from './component/energy-sell/energysell.service';
import {EnergybuyService} from './component/energy-buy/energybuy.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { BanktransactionHistoryComponent } from './component/banktransaction-history/banktransaction-history.component';
import {BanktransationHistoryService} from './component/banktransaction-history/banktransation-history.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LandingpageComponent,
    ResidentComponent,
    BankComponent,
    UtilitycompanyComponent,
    ResidentregComponent,
    ResidenthomeComponent,
    SellenergyComponent,
    BuyenergyComponent,
    GetcoinComponent,
    GetcashComponent,
    LoginbankComponent,
    BankregComponent,
    LogincompanyComponent,
    CompanyregComponent,
    GetcoinutilComponent,
    GetcashutilComponent,
    EnergyhistoryresidentComponent,
    EnergyhistorycompanyComponent,
    TestComponent,
    ResidentprofileComponent,
    EnergyBuyComponent,
    EnergySellComponent,
    BanktransactionHistoryComponent,
 

  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ChartsModule,
    NgxSpinnerModule,
    NgbModule
  ],
  providers: [ResidentService,BanktransationHistoryService,EnergybuyService,EnergysellService,ResidentprofileService,EnergyhistorycompanyService, EnergyhistoryresidentService, BankService, UtilitycompanyService, UtilService, LogincompanyService, BankregService, LoginbankService, GetcashService, GetcoinService, ResidentregService, ResidenthomeService, BuyenergyService, SellenergyService,],
  bootstrap: [AppComponent]
})
export class AppModule { }
