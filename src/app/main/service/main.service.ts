import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MainService {

  private API_URL: string = "https://raw.githubusercontent.com/tsopenteam/bilim/master/bilim.json";

  constructor(private http: HttpClient) { }

  public GetData() {
    return this.http.get(this.API_URL);
  }
}