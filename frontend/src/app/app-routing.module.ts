import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { ArticleComponent } from './components/article/article.component';
import { HomeComponent } from './components/home/home.component';
import { JobDetailsComponent } from './components/job-details/job-details.component';
import { JobsComponent } from './components/jobs/jobs.component';
import { LoginComponent } from './components/login/login.component';
import { MessagingComponent } from './components/messaging/messaging.component';
import { NetworkComponent } from './components/network/network.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { SearchComponent } from './components/search/search.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AdminGuard } from './guards/admin.guard';
import { IsLoggedInGuard } from './guards/is-logged-in.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [IsLoggedInGuard] },
  { path: 'jobs', component: JobsComponent, canActivate: [IsLoggedInGuard] },
  { path: 'jobs/:id', component: JobDetailsComponent, canActivate: [IsLoggedInGuard] },
  { path: 'messaging', component: MessagingComponent, canActivate: [IsLoggedInGuard] },
  { path: 'network', component: NetworkComponent, canActivate: [IsLoggedInGuard] },
  { path: 'connections/:id', component: NetworkComponent, canActivate: [IsLoggedInGuard] },
  { path: 'notifications', component: NotificationsComponent, canActivate: [IsLoggedInGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [IsLoggedInGuard] },
  { path: 'user/:id', component: ProfileComponent, canActivate: [IsLoggedInGuard] },
  { path: 'article/:id', component: ArticleComponent, canActivate: [IsLoggedInGuard] },
  { path: 'search', component: SearchComponent, canActivate: [IsLoggedInGuard] },
  { path: 'admin', component: AdminPanelComponent, canActivate: [IsLoggedInGuard, AdminGuard] },
  { path: '**', pathMatch: 'full', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
