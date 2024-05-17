import { Component, Input, OnInit } from '@angular/core';
import { Note } from '../../models/Note';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { MatTableModule} from '@angular/material/table';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { ListNotesService } from '../../services/list-notes.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-completed-items',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, DatePipe],
  providers: [ListNotesService],
  templateUrl: './completed-items.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  styleUrl: './completed-items.component.scss'
})
export class CompletedItemsComponent implements OnInit {
  listOfCompleted: Array<Note> = [];
  columnsToDisplay = ['id', 'title', 'desc', 'date'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: Note | null = null;

  getAllListSubscription: Subscription = new Subscription();

  constructor(private listNoteService: ListNotesService) {

  }

  ngOnInit(): void {
    this.getAllListSubscription = this.listNoteService.getAllCompletedNotes()
        .subscribe(completedNotes => this.listOfCompleted = completedNotes);
  }
}
