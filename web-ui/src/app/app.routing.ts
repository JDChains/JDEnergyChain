import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { LandingpageComponent } from './component/landingpage/landingpage.component';
import { ResidentComponent } from './component/resident/resident.component';
import { BankComponent } from './component/bank/bank.component';
import { UtilitycompanyComponent } from './component/utilitycompany/utilitycompany.component';
import { ResidentregComponent } from './component/residentreg/residentreg.component';
import { ResidenthomeComponent } from './component/residenthome/residenthome.component';
import { SellenergyComponent } from './component/sellenergy/sellenergy.component';
import { BuyenergyComponent } from './component/buyenergy/buyenergy.component';
import { GetcoinComponent } from './component/getcoin/getcoin.component';
import { GetcashComponent } from './component/getcash/getcash.component';
import { LoginbankComponent } from './component/loginbank/loginbank.component';
import { BankregComponent } from './component/bankreg/bankreg.component';
import { LogincompanyComponent } from './component/logincompany/logincompany.component';
import { CompanyregComponent } from './component/companyreg/companyreg.component';
import { GetcoinutilComponent } from './component/getcoinutil/getcoinutil.component';
import { GetcashutilComponent } from './component/getcashutil/getcashutil.component';
import { EnergyhistoryresidentComponent } from './component/energyhistoryresident/energyhistoryresident.component';
import { EnergyhistorycompanyComponent } from './component/energyhistorycompany/energyhistorycompany.component';
import { TestComponent } from './component/test/test.component';
import { ResidentprofileComponent } from './component/residentprofile/residentprofile.component';
import { EnergyBuyComponent } from './component/energy-buy/energy-buy.component';
import { EnergySellComponent } from './component/energy-sell/energy-sell.component';
import { BanktransactionHistoryComponent } from './component/banktransaction-history/banktransaction-history.component';
export const routes: Routes = [

    { path: '', redirectTo: '/landingpage', pathMatch: 'full' },
    { path: 'landingpage', component: LandingpageComponent },

    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'BanktransactionHistory/:id',
        component: BanktransactionHistoryComponent
    }
    ,
    {
        path:'buy_energy_public',
        component:EnergyBuyComponent
    },
    {
        path:'energysell',
        component:EnergySellComponent
    },

    {
        path: 'energyhistorycompany',
        component: EnergyhistorycompanyComponent
    },


    {
        path: 'energyhistoryresident',
        component: EnergyhistoryresidentComponent
    },

    {
        path: 'getcash',
        component: GetcashComponent
    },


    {
        path: 'getcoin',
        component: GetcoinComponent
    },
    {
        path: 'buyenergy',
        component: BuyenergyComponent
    },
    {
        path: 'sellenergy',
        component: SellenergyComponent
    },
    {
        path: 'residenthome',
        component: ResidenthomeComponent
    },
    {
        path: 'residentreg',
        component: ResidentregComponent
    },
    {
        path: 'resident',
        component: ResidentComponent
    },
    {
        path: 'bank',
        component: BankComponent

    },
    {
        path: 'utilitycompany',
        component: UtilitycompanyComponent
    },
    {
    path:'residentprofile',
    component:ResidentprofileComponent
    }
    ,  //transaction between resident to utilitycompany

    {
        path: 'loginbank',
        component: LoginbankComponent
    },
    {
        path: 'bankreg',
        component: BankregComponent
    },
    {
        path: 'logincompany',
        component: LogincompanyComponent
    },
    {
        path: 'companyreg',
        component: CompanyregComponent
    },
    {
        path: 'getcoinutil',
        component: GetcoinutilComponent
    },
    {
        path: 'getcashutil',
        component: GetcashutilComponent
    },
    {
        path: 'test',
        component:TestComponent
    }
   
]