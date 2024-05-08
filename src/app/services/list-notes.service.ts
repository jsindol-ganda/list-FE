import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { Note } from '../models/Note';
import { NoteResponse } from '../models/NoteResponse';

@Injectable({
  providedIn: 'root'
})
export class ListNotesService {

  constructor(private httpClient: HttpClient) { }

  getAllNotes(): Observable<Array<Note>> {
    return this.httpClient.get<Array<Note>>('http://localhost:8080/api/getAllNotes');
  }

  getANote(id: number): Observable<Note> {
    return this.httpClient.post<Note>('http://localhost:8080/api/getNote', {id})
      .pipe(catchError(error => {throw new Error(error.message)}));
  }

  addNote(note: Note): Observable<NoteResponse> {
    return this.httpClient.post<NoteResponse>('http://localhost:8080/api/addNote', JSON.stringify(note))
    .pipe(catchError(error => {console.log(error); throw new Error(error.message)}));
  }

  updateNote(note: Note): Observable<NoteResponse> {
    return this.httpClient.put<NoteResponse>('http://localhost:8080/api/updateNote', JSON.stringify(note))
    .pipe(catchError(error => {throw new Error(error.message)}));
  }

  deleteNote(id: number): Observable<NoteResponse> {
    return this.httpClient.delete<NoteResponse>('http://localhost:8080/api/deleteNote', {
      body: {id}
    }).pipe(catchError(error => {throw new Error(error.message)}));
  }
}
