import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGradelevelComponent } from './create-gradelevel.component';

describe('CreateGradelevelComponent', () => {
  let component: CreateGradelevelComponent;
  let fixture: ComponentFixture<CreateGradelevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateGradelevelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateGradelevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
