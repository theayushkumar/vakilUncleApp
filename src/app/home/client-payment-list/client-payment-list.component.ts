import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CrudService } from 'src/app/service/crud.service';
import { SharedService } from 'src/app/service/shared.service';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-client-payment-list',
  templateUrl: './client-payment-list.component.html',
  styleUrls: ['./client-payment-list.component.scss'],
})
export class ClientPaymentListComponent implements OnInit {
  cases: any;
  filter_data: any;
  login_data: any;
  login: any;

  constructor(
    private _router: Router,
    private _shared: SharedService,
    private _crud: CrudService
  ) {
    this.login = localStorage.getItem('vakilLoginData');
    this.login_data = JSON.parse(this.login)
  }

  ngOnInit() {
    this._router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.loadData();
    });
  }

  loadData(): void {
    this._crud.get_total_client_payment(this.login_data.advId).subscribe
      ((res: any) => {
        console.log(res, 'total case');
        if (res && res.data) {
          if (Array.isArray(res.data)) {
            const ids: string[] = [];
            res.data.forEach((item: any) => {
              if (item.due === 0) {
                ids.push(item);
                this.cases = ids ;
                this.filter_data = ids ;
              }
            });
          } else {
            console.log('Expected data to be an array, but it is not.');
          }
        } else {
          console.log('No data found in response');
        }
      }
      )
  }

  pyament_Dues() {
    this._router.navigate(['/home/clientduepayment'])
  }

  onSearch(event: any) {
    const filter = event.target.value.toLowerCase();
    this.cases = this.filter_data.filter((data: any) => {
      if (data?.name.toString().toLowerCase().indexOf(filter.toLowerCase()) !== -1) {
        return true;
      }
      if (data?.caseTitle.toString().toLowerCase().indexOf(filter.toLowerCase()) !== -1) {
        return true;
      }
      if (data?.contactNum.toString().toLowerCase().indexOf(filter.toLowerCase()) !== -1) {
        return true;
      }
      if (data?.caseNumber.toString().toLowerCase().indexOf(filter.toLowerCase()) !== -1) {
        return true;
      }
      if (data?.due.toString().toLowerCase().indexOf(filter.toLowerCase()) !== -1) {
        return true;
      }
      return false;
    }
    );
  }
}
