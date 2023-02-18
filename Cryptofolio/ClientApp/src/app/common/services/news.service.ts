import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  public articles: any[] = [];

  constructor(private http: HttpClient) {}

  getNews() {
    const url = `https://newsapi.org/v2/top-headlines?q=crypto&category=business&language=en&apiKey=abf821aef3294839aa9cc34dcc08628f`;
    this.http.get(url).subscribe((data: any) => {
      this.articles = data.articles;
    });
  }
}
