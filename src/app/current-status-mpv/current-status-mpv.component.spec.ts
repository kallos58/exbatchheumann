import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentStatusMpvComponent } from './current-status-mpv.component';

describe('CurrentStatusMpvComponent', () => {
  let component: CurrentStatusMpvComponent;
  let fixture: ComponentFixture<CurrentStatusMpvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentStatusMpvComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentStatusMpvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
