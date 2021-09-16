import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Observable } from 'rxjs'

import { WorkplaceSnapshot } from '@core/models'
import { RoomService } from '@main/services/room.service'

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomComponent {
  roomId: number = this.activatedRoute.snapshot.queryParams['roomId']
  workplaces$: Observable<WorkplaceSnapshot[]> = this.roomService.getRoomSnapshot(this.roomId)

  constructor(
    private activatedRoute: ActivatedRoute,
    private roomService: RoomService,
    private router: Router
  ) { }

  workplaceClicked(workplaceId: number) {
    this.router.navigate(['room/workplace'], { queryParams: { id: workplaceId } })
  }

  trackWorkplaces(index: number, item: WorkplaceSnapshot) {
    return item.workplaceId + item.employee;
  }
}
