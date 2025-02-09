import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthService } from './service/auth/auth.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

class MockRouter {
  navigate = jest.fn();  // Mock der navigate Methode
}

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let authService: AuthService;
  let mockRouter: MockRouter;

  beforeEach(() => {
    // Mocking the AuthService
    const authServiceMock = {
      $isLoggedIn: of(true),  // Mock das Observable
      logout: jest.fn(),      // Mock der logout Methode
    };

    // Mock des Routers
    mockRouter = new MockRouter();

    TestBed.configureTestingModule({
      imports: [
        RouterModule,         // RouterModule importieren
        MatToolbarModule,
        MatButtonModule,
        CommonModule
      ],
      declarations: [AppComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: mockRouter }  // Router mit Mock ersetzen
      ]
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();  // Trigger change detection
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it('should have title "LCA Dashboard"', () => {
    expect(component.title).toBe('LCA Dashboard');
  });

  it('should call logout method of AuthService when logout is triggered', () => {
    component.logout();  // Aufruf der logout-Methode
    expect(authService.logout).toHaveBeenCalled();  // Überprüfen, ob die Methode aufgerufen wurde
  });

  it('should call navigate on Router when logout is triggered', () => {
    component.logout();
    expect(mockRouter.navigate).toHaveBeenCalled();  // Überprüfen, ob navigate aufgerufen wurde
  });
});
