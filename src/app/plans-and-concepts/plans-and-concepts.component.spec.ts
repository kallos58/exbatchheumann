import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlansAndConceptsComponent } from './plans-and-concepts.component';

describe('PlansAndConceptsComponent', () => {
  let component: PlansAndConceptsComponent;
  let fixture: ComponentFixture<PlansAndConceptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlansAndConceptsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlansAndConceptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
