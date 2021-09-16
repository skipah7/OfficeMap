import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Workplace } from '@core/models'

@Injectable({ providedIn: 'root' })
export class WorkplaceService {
  constructor(private http: HttpClient) { }
  getWorkplace(id: number) {
    return this.http.get<Workplace>(`/workplace/${id}`)
  }
}
