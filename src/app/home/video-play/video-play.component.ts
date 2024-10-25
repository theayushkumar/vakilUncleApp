import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SharedService } from 'src/app/service/shared.service';

@Component({
  selector: 'app-video-play',
  templateUrl: './video-play.component.html',
  styleUrls: ['./video-play.component.scss'],
})
export class VideoPlayComponent implements OnInit {
  video_url: SafeResourceUrl | undefined;

  constructor(
    private _shared: SharedService,
    private _sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this._shared.sharedData.subscribe((res: any) => {
      console.log(res);
      this.video_url = this._sanitizer.bypassSecurityTrustResourceUrl(res);
    });
  }

  ngOnDestroy() {
    this._shared.sharedData.unsubscribe();
  }
}
