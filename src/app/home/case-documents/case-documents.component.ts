import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { CrudService } from 'src/app/service/crud.service';
import { SharedService } from 'src/app/service/shared.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-case-documents',
  templateUrl: './case-documents.component.html',
  styleUrls: ['./case-documents.component.scss'],
})
export class CaseDocumentsComponent implements OnInit {

  @ViewChild('modal') modal!: IonModal;

  login: any;
  login_data: any;
  total_case_docs: any;
  img_url: any;
  case: any;
  case_no: any
  docs: any;
  docs_content: any;
  filter_data: any;

  constructor(
    private _crud: CrudService,
    private _shared: SharedService,
    private _router: Router
  ) {
    this.login = localStorage.getItem('vakilLoginData');
    this.login_data = JSON.parse(this.login);

    this._shared.img_url.subscribe(
      (data: any) => {
        this.img_url = data;
      }
    )
  }

  ngOnInit() {
    this._router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.fetchData();
    });
  }
  fetchData() {
    this._crud.get_total_case_list(this.login_data.advId).subscribe(
      (response) => {
        console.log(response, 'case documnet');
        this.total_case_docs = response.data;
        this.filter_data = response.data;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  downloadDocument(url: string) {
    console.log(url, 'url');
    window.open(url, '_blank');
  }

  caseDocs(case_doc: any) {
    console.log(case_doc.caseNo);
    this._crud.get_case_document(this.login_data.advId, case_doc.caseNo).subscribe(
      (response) => {
        if (response.status === true && response.data && response.data.length > 0) {
          this.docs_content = response.data;
          console.log(this.docs_content, 'content');
          this.modal.present();
        } else if (response.data.length === 0) {
          this._shared.tostWrraingTop('No documents available');
        } else {
          this._shared.tostWrraingTop('Unexpected response format or error');
        }
      },
      (error) => {
        this._shared.tostErrorTop('Error fetching case documents:');
      }
    );
  }

  onSearch(event: any): void {
    const filter = event.target.value.toLowerCase();
    this.total_case_docs = this.filter_data.filter((data: any) => {
      return (
        data?.clientName.toString().toLowerCase().includes(filter) ||
        data?.caseNo.toString().toLowerCase().includes(filter)
      );
    });
  }
}
