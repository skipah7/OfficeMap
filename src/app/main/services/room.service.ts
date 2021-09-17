import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { WorkplaceSnapshot } from '@core/models'

@Injectable({ providedIn: 'root' })
export class RoomService {
  constructor(private http: HttpClient) { }
  getRoomSnapshot(id: number) {
    return this.http.get<WorkplaceSnapshot[]>(`/rooms/${id}`);
  }
}
