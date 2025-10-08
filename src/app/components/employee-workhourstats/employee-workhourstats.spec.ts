import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeWorkhourstats } from './employee-workhourstats';

describe('EmployeeWorkhourstats', () => {
  let component: EmployeeWorkhourstats;
  let fixture: ComponentFixture<EmployeeWorkhourstats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeWorkhourstats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeWorkhourstats);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
