import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleMasterComponent } from './articlemaster.component';

describe('SettingsComponent', () => {
  let component: ArticleMasterComponent;
  let fixture: ComponentFixture<ArticleMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
