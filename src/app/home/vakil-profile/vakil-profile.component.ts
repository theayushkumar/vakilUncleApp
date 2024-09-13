import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/service/crud.service';
import { SharedService } from 'src/app/service/shared.service';

@Component({
  selector: 'app-vakil-profile',
  templateUrl: './vakil-profile.component.html',
  styleUrls: ['./vakil-profile.component.scss'],
})
export class VakilProfileComponent implements OnInit {
  vakil_profile_update!: FormGroup
  selectedProfileImage: any;
  states: any;
  citys: any;
  BarCouncil: any;
  profileInfo = {
    Profile_image: 'https://png.pngitem.com/pimgs/s/130-1300400_user-hd-png-download.png',
  };

  login: any;
  login_data: any;
  vId: any;
  dashboard: any;
  img_url: any;

  Aadhar_select: any;
  Aadhar_img_url: any = "../../../assets/images/documents.jpg"
  AadharSelect: boolean = true
  AadharSelected: boolean = false

  Pan_select: any;
  Pan_img_url: any = "../../../assets/images/documents.jpg"
  PanCard: any;
  PanSelect: boolean = true
  PanSelected: boolean = false

  BarCouncil_select: any;
  BarCouncil_img_url: any = "../../../assets/images/documents.jpg"
  BarCouncilCard: any;
  BarCouncilSelect: boolean = true
  BarCouncilSelected: boolean = false

  LLBC_select: any;
  LLBC_img_url: any = "../../../assets/images/documents.jpg"
  LLBCCard: any;
  LLBCSelect: boolean = true
  LLBCSelected: boolean = false
  court_list: any;
  advocate_type: any;
  stateId: any;


  constructor(
    private _router: Router,
    private _crud: CrudService,
    private _shared: SharedService,
    private _formBuilder: FormBuilder
  ) {
    this.login = localStorage.getItem('vakilLoginData')
    this.login_data = JSON.parse(this.login)
  }

  ngOnInit() {
    this.vakil_profile_update = this._formBuilder.group({
      advId: [''],
      advocateName: ['', Validators.required],
      contactNum: ['', Validators.required],
      email: ['', Validators.required],
      gender: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      courtType: ['', Validators.required],
      advType: ['', Validators.required],
      experiance: ['', Validators.required],
      DOB: ['', Validators.required],
      llbRegistrationNum: ['', Validators.required],
      offAddress: ['', Validators.required],
      adhar: [''],
      pan: [''],
      barCouncil: [''],
      llb: [''],
      profile: [''],
      pass: ['', Validators.required],
    });
    this.fetchDropdownData();

    if (this.login_data) {
      this.stateId = this.login_data.state;
      console.log(this.stateId, 'jaasas');
      this.vakil_profile_update.patchValue(this.login_data);
      this.onCityChange({ detail: { value: this.stateId } });
    }
  }

  fetchDropdownData(): void {
    this._shared.img_url.subscribe((data: any) => { this.img_url = data; })
    this._crud.get_state().subscribe((res: any) => { if (res.status === true) { this.states = res.data; } })
    this._crud.get_court_list().subscribe((res: any) => { if (res.status === true) { this.court_list = res.data; } })
    this._crud.get_advocate_type().subscribe((res: any) => { if (res.status === true) { this.advocate_type = res.data; } })
  }

  onCityChange(event: any) {
    const selectedId = event.detail.value;
    console.log(selectedId);
    this._crud.get_city(selectedId).subscribe(
      (res: any) => {
        if (res.status === true) {
          this.citys = res.data;
        }
      }
    )
  }

  // for select Aadhar Card
  onAadhar(files: any) {
    this.AadharSelect = false
    this.AadharSelected = true
    let reader = new FileReader();
    this.Aadhar_select = files[0];
    reader.onload = () => {
      this.Aadhar_img_url = reader.result;
    };
    reader.readAsDataURL(this.Aadhar_select);
  }

  // for select Pan Card
  onPan(files: any) {
    this.PanSelect = false
    this.PanSelected = true
    let reader = new FileReader();
    this.Pan_select = files[0];
    reader.onload = () => {
      this.Pan_img_url = reader.result;
    };
    reader.readAsDataURL(this.Pan_select);
  }

  // for select BarCouncil
  onBarCouncil(files: any) {
    this.BarCouncilSelect = false
    this.BarCouncilSelected = true
    let reader = new FileReader();
    this.BarCouncil_select = files[0];
    reader.onload = () => {
      this.BarCouncil_img_url = reader.result;
    };
    reader.readAsDataURL(this.BarCouncil_select);
  }

  // for select LLBC
  onLLBC(files: any) {
    this.LLBCSelect = false
    this.LLBCSelected = true
    let reader = new FileReader();
    this.LLBC_select = files[0];
    reader.onload = () => {
      this.LLBC_img_url = reader.result;
    };
    reader.readAsDataURL(this.LLBC_select);
  }


  openFile() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.selectedProfileImage = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  }

  async submit() {
    console.log(this.vakil_profile_update.value);

    const formUpdate = new FormData();
    formUpdate.append('vakilId', this.login_data.advId);
    formUpdate.append('advocateName', this.vakil_profile_update.get('advocateName')?.value);
    formUpdate.append('contactNum', this.vakil_profile_update.get('contactNum')?.value);
    formUpdate.append('email', this.vakil_profile_update.get('email')?.value);
    formUpdate.append('state', this.vakil_profile_update.get('state')?.value);
    formUpdate.append('city', this.vakil_profile_update.get('city')?.value);
    formUpdate.append('pass', this.vakil_profile_update.get('pass')?.value);
    formUpdate.append('gender', this.vakil_profile_update.get('gender')?.value);
    formUpdate.append('DOB', this.vakil_profile_update.get('DOB')?.value);
    formUpdate.append('llbRegistrationNum', this.vakil_profile_update.get('llbRegistrationNum')?.value);
    formUpdate.append('offAddress', this.vakil_profile_update.get('offAddress')?.value);
    formUpdate.append('experiance', this.vakil_profile_update.get('experiance')?.value);
    formUpdate.append('advType', this.vakil_profile_update.get('advType')?.value);
    formUpdate.append('courtType', this.vakil_profile_update.get('courtType')?.value);
    formUpdate.append('adhar', this.Aadhar_select);
    formUpdate.append('pan', this.Pan_select);
    formUpdate.append('barCouncil', this.BarCouncil_select);
    formUpdate.append('llb', this.LLBC_select);
    formUpdate.append('profile', this.selectedProfileImage);

    if (this.vakil_profile_update.valid) {
      this._crud.update_vakil_profile(formUpdate).subscribe(
        (res: any) => {
          console.log(res);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
