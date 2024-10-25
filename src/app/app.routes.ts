import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CreationComponent } from './components/creation/creation.component';
import { BlogComponent } from './components/blog/blog.component';
import { AuthGuard } from './guards/authguard.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'create', component: CreationComponent, canActivate: [AuthGuard] },
    { path: 'edit/:id', component: CreationComponent, canActivate: [AuthGuard] },
    { path: 'blog/:id', component: BlogComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '**', redirectTo: 'home',  pathMatch: 'full' },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
];
