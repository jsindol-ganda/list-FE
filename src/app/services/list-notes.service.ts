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
    return this.httpClient.get<Array<Note>>(`${this.url}/api/getAllNotes`);
  }

  getANote(id: number): Observable<Note> {
    return this.httpClient.post<Note>(`${this.url}/api/getNote`, {id})
      .pipe(catchError(error => {throw new Error(error.message)}));
  }

  addNote(note: Note): Observable<NoteResponse> {
    return this.httpClient.post<NoteResponse>(`${this.url}/api/addNote`, note)
    .pipe(catchError(error => {console.log(error); throw new Error(error.message)}));
  }

  updateNote(note: Note): Observable<NoteResponse> {
    return this.httpClient.put<NoteResponse>(`${this.url}/api/updateNote`, note)
    .pipe(catchError(error => {throw new Error(error.message)}));
  }

  deleteNote(id: number): Observable<NoteResponse> {
    return this.httpClient.delete<NoteResponse>(`${this.url}/api/deleteNote`, {
      body: {id}
    }).pipe(catchError(error => {throw new Error(error.message)}));
  }
}
