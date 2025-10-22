import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionExamComponent } from './question-exam.component';

describe('QuestionExamComponent', () => {
  let component: QuestionExamComponent;
  let fixture: ComponentFixture<QuestionExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionExamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
