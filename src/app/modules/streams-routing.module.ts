import { FollowingComponent } from './../components/following/following.component';
import { CommentsComponent } from './../components/comments/comments.component';
import { AuthGuard } from './../services/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StreamsComponent } from '../components/streams/streams.component';
import { PeopleComponent } from '../components/people/people.component';
import { FollowersComponent } from '../components/followers/followers.component';
import { NotificationsComponent } from '../components/notifications/notifications.component';
import { ChatComponent } from '../components/chat/chat.component';

const routes: Routes = [
  {
    path: 'streams', component: StreamsComponent, canActivate: [AuthGuard]
  },
  {
    path: 'post/:id', component: CommentsComponent, canActivate: [AuthGuard]
  },
  {
    path: 'people', component: PeopleComponent, canActivate: [AuthGuard]
  },
  {
    path: 'user/following', component: FollowingComponent, canActivate: [AuthGuard]
  },
  {
    path: 'user/followers', component: FollowersComponent, canActivate: [AuthGuard]
  },
  {
    path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard]
  },
  {
    path: 'chat/:name', component: ChatComponent, canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class StreamsRoutingModule { }
