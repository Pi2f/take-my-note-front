import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Note } from './note';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private notesUrl = 'http://localhost:8080/api/notes';  // URL to web api

  constructor(private http: HttpClient, private messageService: MessageService) { }

  /** POST: add a new note to the server */
  add (note: Note): Observable<Note> {
    return this.http.post<Note>(this.notesUrl, note, httpOptions).pipe(
      tap((note: Note) => this.log(`added note w/ id=${note.id}`)),
      catchError(this.handleError<Note>('add'))
    );
  }

  /** GET note by id. Will 404 if id not found */
  get(): Observable<Note[]> {
    // this.messageService.add('NoteService: added notes');
    return this.http.get<Note[]>(this.notesUrl).pipe(
      tap(notes => this.log('fetched notes')),
      catchError(this.handleError('get', []))
    );
  }

  /** PUT: update the note on the server */
  update(note: Note): Observable<any> {
    return this.http.put(this.notesUrl, note, httpOptions).pipe(
      tap(_ => this.log(`updated note id=${note.id}`)),
      catchError(this.handleError<any>('update'))
    );
  }

  /** DELETE: delete the note from the server */
  delete (note: Note | number): Observable<Note> {
    const id = typeof note === 'number' ? note : note.id;
    const url = `${this.notesUrl}/${id}`;

    return this.http.delete<Note>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted note id=${id}`)),
      catchError(this.handleError<Note>('delete'))
    );
  }

  private log(message: string) {
    this.messageService.add('NoteService: ' + message);
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
