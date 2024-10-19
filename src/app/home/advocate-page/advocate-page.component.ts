import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { CrudService } from 'src/app/service/crud.service';
import { SharedService } from 'src/app/service/shared.service';

@Component({
  selector: 'app-advocate-page',
  templateUrl: './advocate-page.component.html',
  styleUrls: ['./advocate-page.component.scss'],
})
export class AdvocatePageComponent implements OnInit {
  selectedList: string = 'city';
  advocated_list: any;
  img_url: any;

  constructor(
    private _router: Router,
    private _crud: CrudService,
    private _shared: SharedService
  ) { 
    this._shared.img_url.subscribe(
      (res: any) => {
        this.img_url = res
      }
    )
  }

  ngOnInit() {
    this._crud.get_total_advocate_list().subscribe(
      (response) => {
        console.log(response);
        this.advocated_list = response.data
      }
    )
  }

  advocateProfile() {
    this._router.navigate(['/home/advocateportfolio'])
  }

  filterAdvocate() {
    this._router.navigate(['/home/filteradvocate'])
  }
}
