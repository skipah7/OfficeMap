import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Workplace } from '@core/models';

@Injectable({ providedIn: 'root' })
export class ApplyService {
  constructor(private http: HttpClient) { }
  sendApplication(application: Workplace) {
    return this.http.post('/applications/submit', application);
  }
}
