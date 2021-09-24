import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  // Full list of the options available at:https://datatables.net/reference/option/ or node_modules/datatables.net/types/types.d.ts starting at line 1611 (interface Settings)
  dtOptions: DataTables.Settings = {};
  users: User[] = [];
  selectedUserIds = new Set<number>();

  dtTrigger : Subject<any> = new Subject<any>();

  constructor(private usersService: UserService) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthChange: false
    }
    this.usersService.getAllUsers().subscribe(usrs => {
      this.users = usrs;
      this.dtTrigger.next();
    });
  }

  getUserPicPath(user: User) {
    return this.usersService.getProfilePicPath(user);
  }

  onUserCheckboxClick(user: User) {
    if (this.selectedUserIds.has(user.id)) {
      this.selectedUserIds.delete(user.id); 
    } else {
      this.selectedUserIds.add(user.id);
    }
    // console.log(Array.from(this.selectedUserIds));
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
