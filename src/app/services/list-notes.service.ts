import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { Note } from '../models/Note';
import { NoteResponse } from '../models/NoteResponse';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ListNotesService {
  url = environment.apiURL;

  constructor(private httpClient: HttpClient) { }

  getAllNotes(): Observable<Array<Note>> {
    if (!environment.production) {
      return this.httpClient.get<Array<Note>>(`${this.url}/api/getAllNotes`);
    }
    return this.httpClient.get<Array<Note>>(`/api/getAllNotes`);
  }

  getANote(id: number): Observable<Note> {
    if (!environment.production) {
       return this.httpClient.post<Note>(`${this.url}/api/getNote`, {id})
      .pipe(catchError(error => {throw new Error(error.message)}));
    }
    return this.httpClient.post<Note>(`/api/getNote`, {id})
    .pipe(catchError(error => {throw new Error(error.message)}));
  }

  addNote(note: Note): Observable<NoteResponse> {
    if (!environment.production) {
       return this.httpClient.post<NoteResponse>(`${this.url}/api/addNote`, note)
      .pipe(catchError(error => {console.log(error); throw new Error(error.message)}));
    }
    return this.httpClient.post<NoteResponse>(`/api/addNote`, note)
    .pipe(catchError(error => {console.log(error); throw new Error(error.message)}));
  }

  updateNote(note: Note): Observable<NoteResponse> {
    if (!environment.production) {
       return this.httpClient.put<NoteResponse>(`${this.url}/api/updateNote`, note)
       .pipe(catchError(error => {throw new Error(error.message)}));
    }
    return this.httpClient.put<NoteResponse>(`/api/updateNote`, note)
    .pipe(catchError(error => {throw new Error(error.message)}));
  }

  deleteNote(id: number): Observable<NoteResponse> {
   if (!environment.production) {
     return this.httpClient.delete<NoteResponse>(`${this.url}/api/deleteNote`, {
      body: {id}
    }).pipe(catchError(error => {throw new Error(error.message)}));
   }
    return this.httpClient.delete<NoteResponse>(`/api/deleteNote`, {
      body: {id}
    }).pipe(catchError(error => {throw new Error(error.message)}));
  }

  completeTask(id: number, isChecked: boolean) {
    if (!environment.production) {
      return this.httpClient.put<NoteResponse>(`${this.url}/api/updateTask`, {id, isChecked}).pipe(catchError(error => {throw new Error(error.message)}));
    }

    return this.httpClient.put<NoteResponse>(`/api/updateTask`, {id, isChecked}).pipe(catchError(error => {throw new Error(error.message)}));
  }

  getAllCompletedNotes(): Observable<Array<Note>> {
    if (!environment.production) {
      return this.httpClient.get<Array<Note>>(`${this.url}/api/getAllCompleteNotes`);
    }
    return this.httpClient.get<Array<Note>>(`/api/getAllCompleteNotes`);
  }
}
