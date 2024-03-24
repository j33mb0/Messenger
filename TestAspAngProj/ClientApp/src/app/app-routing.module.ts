import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainpageComponent } from './mainpage/mainpage.component';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { AuthGuard } from './AuthGuard';

const routes: Routes = [
  { path:"", component: MainpageComponent, canActivate: [AuthGuard]},
  { path:"login", component: LoginpageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }