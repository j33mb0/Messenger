import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { matchFieldsAsyncValidator } from './matchFieldsValidator';
import { AuthService } from '../auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css'],
})
export class LoginpageComponent implements OnInit {
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  fb = inject(FormBuilder);
  router = inject(Router);
  authService = inject(AuthService);

  errorMsg: string = 'error';
  registerErrorMsg: string = 'error';


  



  ngOnInit(): void {
    this.loginForm = this.fb.group(
      {
        login: ['', [Validators.required, Validators.minLength(6)]],
        password: ['', [Validators.required, Validators.minLength(8)]]
      }
    );
    this.registerForm = this.fb.group(
      {
        login: ['', [Validators.required, Validators.minLength(6)]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
      },
      {
        asyncValidators: [matchFieldsAsyncValidator('password', 'confirmPassword')],
      }
    );
  }

  isLoginFormVisible: boolean = true;
  isRegisterFormVisible: boolean = false;
  isFirstButtonSelected: boolean = true;
  isSecondButtonSelected: boolean = false;
  isLoginErrorVisible: boolean = false;
  isRegisterErrorVisible: boolean = false;
  isRegisterSuccessful: boolean = false;


  toogleForm(formId:string){
    if(formId === 'loginForm'){
      this.isLoginFormVisible = true;
      this.isRegisterFormVisible = false;
      this.isFirstButtonSelected = true;
      this.isSecondButtonSelected = false;
    }
    else if(formId === 'registerForm'){
      this.isLoginFormVisible = false;
      this.isRegisterFormVisible = true;
      this.isFirstButtonSelected = false;
      this.isSecondButtonSelected = true;
      this.isLoginErrorVisible = false;
    }
  }

  login(): void {
    this.isLoginErrorVisible = false;
    const login = this.loginForm.get('login')?.value;
    const password = this.loginForm.get('password')?.value;
    this.authService.login(login, password).subscribe(
      (response) => {
        this.authService.setToken(response.token);
        this.router.navigate(['']);
      },
      (error) => {
        this.isLoginErrorVisible = true;
        this.errorMsg = error.error;
      }
    )
  }
  register(): void {
    this.isRegisterErrorVisible = false;
    const login = this.registerForm.get('login')?.value;
    const password = this.registerForm.get('password')?.value;
    this.authService.register(login, password).subscribe(
      (response) => {
        console.log('register succsesful');
        this.toogleForm('loginForm');
        this.isRegisterSuccessful = true;
      },
      (error) => {
        this.isRegisterErrorVisible = true;
        this.registerErrorMsg = error.error;
      }
    )
  }
}
