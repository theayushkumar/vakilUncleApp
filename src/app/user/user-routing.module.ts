import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserCasePanelComponent } from './user-case-panel/user-case-panel.component';
import { ContactPanelComponent } from './contact-panel/contact-panel.component';
import { AccountComponent } from './account/account.component';
import { IpcPanelComponent } from '../home/ipc-panel/ipc-panel.component';
import { AdvocatePageComponent } from '../home/advocate-page/advocate-page.component';
import { UserChangePasswordComponent } from './user-change-password/user-change-password.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomePageComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'contact', component: ContactPanelComponent },
      { path: 'account', component: AccountComponent },
      { path: 'advocate', component: AdvocatePageComponent },
      { path: 'clientcase', component: UserCasePanelComponent },
      { path: 'clientchangepassword', component: UserChangePasswordComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
