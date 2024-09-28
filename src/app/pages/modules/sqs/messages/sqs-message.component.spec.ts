import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SqsMessageComponent } from './sqs-message.component';

describe('HomeComponent', () => {
  let component: SqsMessageComponent;
  let fixture: ComponentFixture<SqsMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SqsMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SqsMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
