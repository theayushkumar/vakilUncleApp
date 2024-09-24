import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { CrudService } from 'src/app/service/crud.service';
import { SharedService } from 'src/app/service/shared.service';
import { Clipboard } from '@capacitor/clipboard';


@Component({
  selector: 'app-video-management',
  templateUrl: './video-management.component.html',
  styleUrls: ['./video-management.component.scss'],
})
export class VideoManagementComponent implements OnInit {
  @ViewChild('modal') modal !: IonModal;
  login: any;
  login_data: any;
  videoList: any;
  filter_data: any;

  constructor(
    private _crud: CrudService,
    private _shared: SharedService
  ) {
    this.login = localStorage.getItem('vakilLoginData');
    this.login_data = JSON.parse(this.login)
  }

  ngOnInit() {
    this._crud.get_video(this.login_data.advId).subscribe(
      (res: any) => {
        if (res.status === true) {
          this.videoList = res.data;
          this.filter_data = res.data;
        }
      },
      (err: any) => {
        console.log(err);
        this._shared.tostErrorTop('No Data')
      }
    )
  }

  AddVideo() {
    this.modal.present()
  }

  backButton() {
    this.modal.dismiss()
  }

  async copyUrl(videoUrl: string) {
    await Clipboard.write({
      string: videoUrl
    });
    this._shared.tostSuccessTop('Copied Success');
  }

  onSearch(event: any) {
    const filter = event.target.value.toLowerCase();
    this.videoList = this.filter_data.filter((data: any) =>
      data.title.toLowerCase().includes(filter) ||
      data.videoUrl.toLowerCase().includes(filter)
    );
  }
}