import { Pipe, PipeTransform } from '@angular/core';
import { WorkplaceSnapshot } from '@core/models';

@Pipe({
  name: 'workplaceSnapshot',
  pure: true,
})
export class WorkplaceSnapshotPipe implements PipeTransform {
  transform(value: WorkplaceSnapshot): string {
    const workplaceStatus = value?.employee === '' ? 'empty workplace' : value?.employee;
    return `${value?.workplaceId} - ${workplaceStatus}`;
  }
}
