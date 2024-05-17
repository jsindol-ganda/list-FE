import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { Note } from './models/Note';
import { ListNotesService } from './services/list-notes.service';
import { Subscription, concatMap, from } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { ToastrService } from 'ngx-toastr';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import { SelectionModel } from '@angular/cdk/collections';
import { CompletedItemsComponent } from './components/completed-items/completed-items.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatTableModule, MatCheckboxModule, MatButtonModule, MatCardModule, DatePipe, CommonModule,
            MatFormFieldModule, FormsModule, ReactiveFormsModule, MatDatepickerModule, MatInputModule,
            MatCheckboxModule, MatIconModule, CompletedItemsComponent],
  providers: [ListNotesService, ToastrService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'myList';
  toAdd = false;
  toShowDetail = false;
  listOfNotes: MatTableDataSource<Note> = new MatTableDataSource();
  noteGroup: FormGroup;
  selectedNote: Note = {};
  toModify = false;
  notesSelected = new SelectionModel<Note>(true, []);
  displayedColumns = ['select', 'title']
  showNotesFinished = false;

  listTypeSubscription: Subscription = new Subscription();
  addNotSubscription: Subscription = new Subscription();
  selectedNoteSubscription: Subscription = new Subscription();
  updateNoteSubscription: Subscription = new Subscription();
  deleteNoteSubscription: Subscription = new Subscription();
  markAsCompleteSubscription: Subscription = new Subscription();

  constructor(private listService: ListNotesService, private formBulder: FormBuilder, private toast: ToastrService) {
    this.noteGroup = this.formBulder.group({
      id: [null],
      title: ['', Validators.required],
      desc: ['', Validators.required],
      date: [null, Validators.required],
      isChecked: [false]
    })
  }

  ngOnInit(): void {
    this.initNotes();
  }

  saveNote() {
    if (!this.toModify && !this.noteGroup.valid) {
      this.toast.error('Please fill out the note properly');
    }
    if (!this.toModify && !(this.noteGroup.get('date')?.value instanceof Date)) {
      this.toast.error('Invalid date');
    }
    
    if (this.toModify) {
      this.updateNoteSubscription = this.listService.updateNote({...this.noteGroup.value}).subscribe(res => {
        this.toast.success(res.message);
        this.toAdd = false;
        this.noteGroup.reset();
        this.noteGroup.clearAsyncValidators();
        this.initNotes();

      })
    } else {
      this.addNotSubscription = this.listService.addNote({...this.noteGroup.value}).subscribe(res => {
        this.toast.success(res.message);
        this.toAdd = false;
        this.noteGroup.reset();
        this.noteGroup.clearAsyncValidators();
        this.initNotes();
      });
    }

  }

  initNotes() {
    this.listTypeSubscription = this.listService.getAllNotes().subscribe(notes => {
      this.listOfNotes = new MatTableDataSource<Note>(notes.filter(item => !item.isChecked));
    });
  }

  editNote() {
    this.toShowDetail = false;
    this.toAdd = true;
    this.toModify = true;
    this.noteGroup.get('title')?.setValue(this.selectedNote.title);
    this.noteGroup.get('desc')?.setValue(this.selectedNote.desc);
    this.noteGroup.get('id')?.setValue(this.selectedNote.id);
  }

  deleteNote() {
    if (this.selectedNote.id) {
      this.listService.deleteNote(this.selectedNote.id).subscribe(res => {
        this.toast.success(res.message);
        this.initNotes();

      })
    }
    this.toShowDetail = false;
  }

  showDetails(note: Note) {
    this.toAdd = false;
    this.toShowDetail = true;
    this.selectedNote = note;
  }

  closeDetail() {
    this.toShowDetail = false;
  }

  showAdd() {
    this.toShowDetail = false; 
    this.toAdd = !this.toAdd;
    if (this.selectedNote) {
      this.noteGroup.reset();
      this.selectedNote = {};
    }
  }

  ngOnDestroy(): void {
    this.listTypeSubscription.unsubscribe();
    this.addNotSubscription.unsubscribe();
    this.selectedNoteSubscription.unsubscribe();
    this.updateNoteSubscription.unsubscribe();
    this.deleteNoteSubscription.unsubscribe();
    this.markAsCompleteSubscription.unsubscribe();
  }

  
  isAllSelected() {
    const numSelected = this.notesSelected.selected.length;
    const numRows = this.listOfNotes.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.notesSelected.clear();
      return;
    }

    this.notesSelected.select(...this.listOfNotes.data);
  }

  checkboxLabel(row?: Note): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.notesSelected.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }

  markAsComplete() {
    console.log(this.notesSelected.selected)
    const markedCompleted = this.notesSelected.selected.map(item => {item.isChecked = true; return item});
    this.markAsCompleteSubscription = from(markedCompleted).pipe(
      concatMap(note => {
        return this.listService.completeTask(note.id as number, note.isChecked as boolean)
      })
    ).subscribe(res => {
      this.toast.success(res.message);
      this.initNotes();
      this.notesSelected.clear();
      this.showNotesFinished = true;
    })
  }



}
