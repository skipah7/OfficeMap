import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators'

import { Room } from '@core/models';
import { FeatureCollection, HomeService } from '@main/services/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  projection: any;
  roomsData: FeatureCollection;
  buildingData: FeatureCollection;
  rooms: Room[] = [];

  constructor(
    private router: Router,
    private homeService: HomeService,
  ) {
    this.roomsData = this.homeService.getRoomsData();
    this.buildingData = this.homeService.getBuildingData();
    this.projection = {
      to(coordinates: number[]) {
        return [coordinates[0] / 100, coordinates[1] / 100];
      },
      from(coordinates: number[]) {
        return [coordinates[0] * 100, coordinates[1] * 100];
      }
    };
    this.homeService.getRooms().pipe(first()).subscribe(rooms => {
      this.rooms = rooms;
    });
  }

  layerClicked(event: any) {
    const layerId: number = event.target?.attribute('id');
    if (layerId) {
      this.router.navigate(['/room'], { queryParams: { roomId: layerId } });
    }
  }

  // customizeTooltip(arg: any) {
  //   if (arg.layer.name === 'rooms') {
  //     return {
  //       text: "Square: " + arg.attribute('workingPlaces') + " ft&#178"
  //     }
  //   }
  //   return { text: '' }
  // }

  // customizeLayers(elements: any) {
  //   elements.forEach((element: any) => {
  //     const matchingRoom = this.rooms.find(room => {
  //       room.id = element.attribute('id')
  //     })
  //     element.attribute('workingPlaces', matchingRoom?.workplaces.length)
  //   })
  // }
}
