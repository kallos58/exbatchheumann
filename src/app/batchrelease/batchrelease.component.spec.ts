import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchreleaseComponent } from './batchrelease.component';

describe('BatchreleaseComponent', () => {
  let component: BatchreleaseComponent;
  let fixture: ComponentFixture<BatchreleaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchreleaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchreleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
