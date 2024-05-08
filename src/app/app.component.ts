import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { Note } from './models/Note';
import { ListNotesService } from './services/list-notes.service';
import { Subscription } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatListModule, MatButtonModule, MatCardModule, DatePipe, CommonModule,
            MatFormFieldModule, FormsModule, ReactiveFormsModule, MatDatepickerModule, MatInputModule],
  providers: [ListNotesService, ToastrService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'myList';
  toAdd = false;
  toShowDetail = false;
  listOfNotes: Array<Note>  = [];
  noteGroup: FormGroup;
  selectedNote: Note = {};
  toModify = false;

  listTypeSubscription: Subscription = new Subscription();
  addNotSubscription: Subscription = new Subscription();
  selectedNoteSubscription: Subscription = new Subscription();
  updateNoteSubscription: Subscription = new Subscription();
  deleteNoteSubscription: Subscription = new Subscription();

  constructor(private listService: ListNotesService, private formBulder: FormBuilder, private toast: ToastrService) {
    this.noteGroup = this.formBulder.group({
      id: [null],
      title: ['', Validators.required],
      desc: ['', Validators.required],
      date: [null, Validators.required]
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
      this.listOfNotes = notes;
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
    this.toShowDetail = !this.toShowDetail;
    this.selectedNote = note;
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
  }

  
  



}
