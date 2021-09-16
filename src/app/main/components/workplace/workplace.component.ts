import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Workplace } from '@core/models';
import { WorkplaceService } from '@main/services/workplace.service';

@Component({
  selector: 'app-workplace',
  templateUrl: './workplace.component.html',
  styleUrls: ['./workplace.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkplaceComponent {
  workplaceId: number = this.activatedRoute.snapshot.queryParams['id']
  workplace$: Observable<Workplace> = this.workplaceService.getWorkplace(this.workplaceId)

  constructor(
    private activatedRoute: ActivatedRoute,
    private workplaceService: WorkplaceService,
    private router: Router
  ) { }

  applyToWorkplace(id: number) {
    this.router.navigate(['room/workplace/apply'], { queryParams: { workplaceId: id } })
  }
}
