import { HttpClient } from "@angular/common/http";
import { Injectable, Inject } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})

//Export class for URL from backend/database
export class ApiService {
  private baseUrl: string;

  public constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.baseUrl = baseUrl + 'api';
  }

  //Get method for baseURL
  public get<T>(url: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${url}`);
  }

  //Post method for baseURL
  public post<T>(url: string, body: any): Observable<any> {
    return this.http.post<T>(`${this.baseUrl}/${url}`, body);
  }

  //Delete method for baseURL
  public delete(url: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${url}`);
  }

  //Put method for baseURl
  public put(url: string, body: any): any {
    return this.http.put(`${this.baseUrl}/${url}`, body);
  }
}
