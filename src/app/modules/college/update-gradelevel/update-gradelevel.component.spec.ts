import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateGradelevelComponent } from './update-gradelevel.component';

describe('UpdateGradelevelComponent', () => {
  let component: UpdateGradelevelComponent;
  let fixture: ComponentFixture<UpdateGradelevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateGradelevelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateGradelevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
