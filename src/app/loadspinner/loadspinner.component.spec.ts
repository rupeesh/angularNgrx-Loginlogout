import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadspinnerComponent } from './loadspinner.component';

describe('LoadspinnerComponent', () => {
  let component: LoadspinnerComponent;
  let fixture: ComponentFixture<LoadspinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadspinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadspinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
