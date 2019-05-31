import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Port } from '../model/ports';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  dataChange: BehaviorSubject<Port[]> = new BehaviorSubject<Port[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;

  constructor(private http: HttpClient) { }

  get data(): Port[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

   /** CRUD METHODS */
   getAllPorts(): void {

    const PORTS_URL = '../../../assets/api/ports.json';

    this.http.get<Port[]>(PORTS_URL).subscribe(data => {
        this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
      });
  }

  addPort(issue: Port): void {
    this.dialogData = issue;
  }

  updatePort(issue: Port): void {
    this.dialogData = issue;
  }

  deletePort(id: number): void {
    console.log(id);
  }
}
