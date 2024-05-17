import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomFaceComponent } from './random-face.component';

describe('RandomFaceComponent', () => {
  let component: RandomFaceComponent;
  let fixture: ComponentFixture<RandomFaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RandomFaceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RandomFaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
