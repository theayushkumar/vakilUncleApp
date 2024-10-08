import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/service/crud.service';
import { SharedService } from 'src/app/service/shared.service';

@Component({
  selector: 'app-membership-management',
  templateUrl: './membership-management.component.html',
  styleUrls: ['./membership-management.component.scss'],
})
export class MembershipManagementComponent implements OnInit {
  membershipDetail: any;
  login: any;
  login_data: any;
  memberships: any;

  constructor(
    private _router: Router,
    private _crud: CrudService,
    private _shared: SharedService
  ) { 
    this.login = localStorage.getItem('vakilLoginData');
		this.login_data = this.login ? JSON.parse(this.login) : {};
  }

  ngOnInit() {
    this._crud.get_plan_details(this.login_data?.advId).subscribe(
			(res: any) => {
				this.memberships = res.data[0]
				console.log(this.memberships?.planId, 'p id');
			},
			(error) => this._shared.tostErrorTop('Error')
		);

    this._crud.get_membership_detail().subscribe(
      (response) => {
        console.log(response);
        try {
          if (response.status === true) {
            this.membershipDetail = response.data;
            console.log(this.membershipDetail, 'memeber');
          } else {
            console.error('Failed to fetch membership details');
          }
        } catch (error) {
          console.error('Error occurred while processing membership details', error);
        }
      },
      (error) => {
        console.error('Error occurred during the API call', error);
      }
    );
  }

  onPayment(item: any) {
    this._router.navigate(['/home/membershipPremium']);
    localStorage.setItem('MembershipPay',JSON.stringify(item))
  }
}
