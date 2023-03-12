import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {


  public coinSymbol: BehaviorSubject<string> = new BehaviorSubject<string>('');
  constructor() { }
}
