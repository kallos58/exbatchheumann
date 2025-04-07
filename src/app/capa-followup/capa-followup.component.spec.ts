import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapaFollowupComponent } from './capa-followup.component';

describe('CapaFollowupComponent', () => {
  let component: CapaFollowupComponent;
  let fixture: ComponentFixture<CapaFollowupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapaFollowupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapaFollowupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
