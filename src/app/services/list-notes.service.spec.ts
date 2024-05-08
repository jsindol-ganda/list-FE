import { TestBed } from '@angular/core/testing';

import { ListNotesService } from './list-notes.service';

describe('ListNotesService', () => {
  let service: ListNotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListNotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
