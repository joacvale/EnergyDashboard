import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeritOrderComponent } from './merit-order-component';

describe('MeritOrderComponent', () => {
  let component: MeritOrderComponent;
  let fixture: ComponentFixture<MeritOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeritOrderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MeritOrderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
