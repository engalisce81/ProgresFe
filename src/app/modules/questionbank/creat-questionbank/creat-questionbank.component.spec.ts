import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatQuestionbankComponent } from './creat-questionbank.component';

describe('CreatQuestionbankComponent', () => {
  let component: CreatQuestionbankComponent;
  let fixture: ComponentFixture<CreatQuestionbankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatQuestionbankComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatQuestionbankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
