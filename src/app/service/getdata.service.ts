import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, tap, map, delay } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { Country } from '../model/country';
import { Declarationtype } from '../model/declarationtypes';
import { State } from '../model/state';

// Configure the amount of latency and jitter to simulate
const apiLatency = 100;

// Set to 3000 to see that out-of-order replies don't cause any problem:
const apiJitter = 100;

@Injectable({
  providedIn: 'root'
})
export class GetdataService {

  constructor(private http: HttpClient) { }

  getAllDeclarationTypes() {
    const declarationTypesUrl = '../../../assets/api/declarationtypes.json';

    return this.http.get<Declarationtype[]>(declarationTypesUrl).pipe(
      tap(this.doGetDeclarationTypes()),
      catchError(this.handleError)
    );
  }

  getAllStates() {
    const states = '../../assets/api/countrygroups.json';
    return this.http.get<State[]>(states).pipe(
      tap(this.doGetStates()),
      catchError(this.handleError));
  }

  getAllCountries() {
    const countries = '../../assets/api/countries.json';
    return this.http.get<Country[]>(countries).pipe(
      tap(this.doGetCountries()),
      catchError(this.handleError));
  }

  randomDelay() {
    return Math.round(apiLatency + Math.random() * apiJitter);
  }

 private doGetCountries(): (x: Country[]) => void {
    return data =>
    console.log(
      'The following declaration types were returned: ' + JSON.stringify(data)
    );
  }

 private doGetStates(): (x: State[]) => void {
    return data =>
    console.log(
      'The following declaration types were returned: ' + JSON.stringify(data)
    );
  }

 private doGetDeclarationTypes(): (x: Declarationtype[]) => void {
    return data =>
      console.log(
        'The following declaration types were returned: ' + JSON.stringify(data)
      );
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred ${err.error.message}`;
    } else {
      errorMessage = `Server side returned code: ${
        err.status
      }, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
