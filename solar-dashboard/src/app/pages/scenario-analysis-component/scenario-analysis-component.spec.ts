import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioAnalysisComponent } from './scenario-analysis-component';

describe('ScenarioAnalysisComponent', () => {
  let component: ScenarioAnalysisComponent;
  let fixture: ComponentFixture<ScenarioAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScenarioAnalysisComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScenarioAnalysisComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
