import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home-component';
import { provideRouter } from '@angular/router';


describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([])],

    }).compileComponents();
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  //#1
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //#2
  it('should render welcome title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Welcome to Solar Energy Dashboard');
  });

  //#3
  it('should render subtitle', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Monitor, analyze and optimize renewable energy production');
  });

  //#4
  it('should render two action cards', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('app-action-cards-component');
    expect(cards.length).toBe(2);
  });

  //#5
  it('should render mat-card', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const card = compiled.querySelector('mat-card');
    expect(card).toBeTruthy();
  });
});