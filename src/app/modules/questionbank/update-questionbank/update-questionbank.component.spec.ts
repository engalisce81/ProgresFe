import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateQuestionbankComponent } from './update-questionbank.component';

describe('UpdateQuestionbankComponent', () => {
  let component: UpdateQuestionbankComponent;
  let fixture: ComponentFixture<UpdateQuestionbankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateQuestionbankComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateQuestionbankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
