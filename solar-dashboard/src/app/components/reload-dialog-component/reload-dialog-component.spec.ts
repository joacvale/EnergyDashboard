import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReloadDialogComponent } from './reload-dialog-component';

describe('ReloadDialogComponent', () => {
  let component: ReloadDialogComponent;
  let fixture: ComponentFixture<ReloadDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReloadDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReloadDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
