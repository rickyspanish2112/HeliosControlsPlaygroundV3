import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, tap, map, delay } from 'rxjs/operators';
import { throwError, Observable, BehaviorSubject } from 'rxjs';
import { Country } from '../model/country';
import { Declarationtype } from '../model/declarationtypes';
import { State } from '../model/state';
import { Port } from '../model/ports';


@Injectable({
  providedIn: 'root'
})
export class GetdataService {

  dataChange: BehaviorSubject<Port[]> = new BehaviorSubject<Port[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;

  constructor(private http: HttpClient) { }

  getAllDeclarationTypes() {
    const DECLARATION_TYPES_URL = '../../../assets/api/declarationtypes.json';

    return this.http.get<Declarationtype[]>(DECLARATION_TYPES_URL).pipe(
      tap(this.doGetDeclarationTypes()),
      catchError(this.handleError)
    );
  }

  getAllStates() {
    const STATES_URL = '../../assets/api/countrygroups.json';
    return this.http.get<State[]>(STATES_URL).pipe(
      tap(this.doGetStates()),
      catchError(this.handleError));
  }

  getAllCountries() {
    const COUNTRIES = '../../assets/api/countries.json';
    return this.http.get<Country[]>(COUNTRIES).pipe(
      tap(this.doGetCountries()),
      catchError(this.handleError));
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
