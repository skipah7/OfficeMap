import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'regime',
  pure: true
})
export class RegimePipe implements PipeTransform {
  transform(value: number[]): string {
    const startHours = value[0].toString().slice(0,value[0].toString().length - 2)
    const startMinutes = value[0].toString().slice(value[0].toString().length - 2)
    const endHours = value[1].toString().slice(0,value[1].toString().length - 2)
    const endMinutes = value[1].toString().slice(value[1].toString().length - 2)

    return `${startHours}:${startMinutes}-${endHours}:${endMinutes}`;
  }

}
