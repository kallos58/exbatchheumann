import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterBySapnoComponent } from './master-by-sapno.component';

describe('MasterBySapnoComponent', () => {
  let component: MasterBySapnoComponent;
  let fixture: ComponentFixture<MasterBySapnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterBySapnoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterBySapnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
