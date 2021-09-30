import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { JwtModule } from '@auth0/angular-jwt';
import { MessagingComponent } from './components/messaging/messaging.component';
import { NetworkComponent } from './components/network/network.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { SettingsComponent } from './components/settings/settings.component';
import { FriendRequestComponent } from './components/friend-request/friend-request.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { NotificationComponent } from './components/notification/notification.component';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { ArticleComponent } from './components/article/article.component';
import { SearchComponent } from './components/search/search.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EmploymentTypeFormatterPipe } from './pipes/employment-type-formatter.pipe';
import { ExperiencesSorterPipe } from './pipes/experiences-sorter.pipe';
import { EducationsSorterPipe } from './pipes/educations-sorter.pipe';
import { ActiveChatComponent } from './components/active-chat/active-chat.component';
import { ChatRowComponent } from './components/chat-row/chat-row.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { DataTablesModule } from 'angular-datatables';
import { UserRoleFormatterPipe } from './pipes/user-role-formatter.pipe';
import { JobsComponent } from './components/jobs/jobs.component';
import { JobRowComponent } from './components/job-row/job-row.component';
import { JobDetailsComponent } from './components/job-details/job-details.component';
import { UserRowComponent } from './components/user-row/user-row.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    NavbarComponent,
    MessagingComponent,
    NetworkComponent,
    NotificationsComponent,
    SettingsComponent,
    FriendRequestComponent,
    PageNotFoundComponent,
    NotificationComponent,
    DateAgoPipe,
    ArticleComponent,
    SearchComponent,
    EmploymentTypeFormatterPipe,
    ExperiencesSorterPipe,
    EducationsSorterPipe,
    ActiveChatComponent,
    ChatRowComponent,
    AdminPanelComponent,
    UserRoleFormatterPipe,
    JobsComponent,
    JobRowComponent,
    JobDetailsComponent,
    UserRowComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('auth-token');
        },
        allowedDomains: ['localhost:3000']
      }
    }),
    NgbModule,
    DataTablesModule
  ],
  bootstrap: [AppComponent],
  providers: [
    EducationsSorterPipe,
    ExperiencesSorterPipe
  ]
})
export class AppModule { }
