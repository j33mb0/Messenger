import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { DataService } from '../data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-headerpage',
  templateUrl: './headerpage.component.html',
  styleUrls: ['./headerpage.component.css']
})
export class HeaderpageComponent implements OnInit {
  router = inject(Router);
  authService = inject(AuthService);
  dataService = inject(DataService);

  changeNicknameForm!: FormGroup;
  changeAvatarForm!: FormGroup;
  fb = inject(FormBuilder);

  isDropdownOpen: boolean = false;

  isChangeNicknameErrorVisible: boolean = false;
  changeNicknameError: string = '';

  isChangeAvatarErrorVisible: boolean = false;
  changeAvatarError: string = '';

  username: string = 'username';
  userimg: string = 'https://cdn-icons-png.flaticon.com/512/3607/3607444.png';

  ngOnInit() {
    this.getUserData();
      this.changeNicknameForm = this.fb.group({
        nickname: ['', [Validators.required, Validators.minLength(6)]]
      });
      this.changeAvatarForm = this.fb.group({
        url: ['', [Validators.required, Validators.minLength(6)]]
      });
  }

  toogleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logOut() {
    this.authService.removeToken();
    this.router.navigate(['/login']);
  }

  changeNickname() {
    var nickname = this.changeNicknameForm.get('nickname')?.value;
    this.dataService.changeNickname(nickname).subscribe(
      (response) => {
        this.isChangeNicknameErrorVisible = false;
        this.getUserData();
      },
      (error) => {
        this.changeNicknameError = error.error;
        this.isChangeNicknameErrorVisible = true;
      }
    )
  }

  changeUserimg() {
    var userImg = this.changeAvatarForm.get('url')?.value;
    this.dataService.changeUserImg(userImg).subscribe(
      (response) => {
        this.isChangeAvatarErrorVisible = false;
        this.getUserData();
      },
      (error) => {
        this.changeAvatarError = error.error;
        this.isChangeAvatarErrorVisible = true;
      }
    )
  }

  getUserData(){
    this.dataService.getUserData().subscribe(
      (userData) => {
        this.username = userData.username;
        this.userimg = userData.userimgurl;
      },
      (error) => {
      }
      );
  }
}

