import { Component, OnInit } from '@angular/core';
import { Note } from '../note';
import { NoteService } from '../note.service';
import {MessageService} from "../message.service";

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})

export class NotesComponent implements OnInit {
  notes: Note[];
  selectedNote: Note;

  constructor(private noteService: NoteService, private messageService: MessageService) {

  }

  ngOnInit() {
     this.get();
  }

  get(): void {
    this.noteService.get()
                    .subscribe(notes => this.notes = notes);
  }

  add(id1: string, title: string, data: string): void {
    data = data.trim();
    title = title.trim();
    var id: number;
    id = parseInt(id1);

    if (!data) { return; }
    this.noteService.add({ id, title, data } as Note)
      .subscribe(note => {
        this.notes.push(note);
      });
  }

  delete(note: Note): void {
    this.notes = this.notes.filter(n => n !== note);
    this.noteService.delete(note).subscribe();
  }

  /** Log a NoteService message with the MessageService */
  private log(message: string) {
    this.messageService.add('NoteService: ' + message);
  }

  onSelect(note: Note): void {
    this.selectedNote = note;
  }

  update(note: Note): void {
    this.noteService.update(note).subscribe();
  }
}
