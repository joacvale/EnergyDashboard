import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar-component';
import { provideRouter } from '@angular/router';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>; 

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  //#1
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //#2
  it('should have correct title', () => {
    expect(component.title).toBe('Solar Energy Dashboard');
  });

  //#3
  it('should have correct icon', () => {
    expect(component.icon).toBe('light_mode');
  });

  //#4
  it('should render title in template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Solar Energy Dashboard');
  });

  //#5
  it('should render icon in template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('light_mode');
  });
});