import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageStateComponent } from './page-state-component';

describe('PageStateComponent', () => {

  let component: PageStateComponent;
  let fixture: ComponentFixture<PageStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageStateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display loading state', () => {

    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent)
      .toContain('Loading panels from API...');
  });

  it('should display error state', () => {

    fixture.componentRef.setInput(
      'error',
      'Backend unavailable'
    );

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent)
      .toContain('Cannot Connect to Backend');

    expect(compiled.textContent)
      .toContain('Backend unavailable');
  });

  it('should display empty state', () => {

    fixture.componentRef.setInput(
      'isEmpty',
      true
    );

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent)
      .toContain('No panels found');

    expect(compiled.textContent)
      .toContain('Add your first solar panel');
  });

  it('should emit retry event', () => {

    const retrySpy = vi.fn();

    component.retry.subscribe(retrySpy);

    component.retry.emit();

    expect(retrySpy).toHaveBeenCalled();
  });

  it('should emit add event', () => {

    const addSpy = vi.fn();

    component.add.subscribe(addSpy);

    component.add.emit();

    expect(addSpy).toHaveBeenCalled();
  });

});