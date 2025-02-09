import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpParams } from '@angular/common/http';

describe('ApiService', () => {
  let apiService: ApiService;
  let httpTestingController: HttpTestingController;

  const mockLCAData: any[] = [
    { name: 'Chemical A', cas: '123-45-6', country: 'USA', total: 100, bioEmission: 50, bioRemoval: 20, fossil: 30, landUse: 40 },
    { name: 'Chemical B', cas: '789-01-2', country: 'Germany', total: 200, bioEmission: 60, bioRemoval: 25, fossil: 35, landUse: 45 }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });

    apiService = TestBed.inject(ApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should make a POST request to request a token', () => {
    const username = 'user';
    const password = 'password';
    const mockResponse = { access_token: 'mock-token' };

    apiService.requestToken(username, password).subscribe(response => {
      expect(response.access_token).toBe('mock-token');
    });

    const req = httpTestingController.expectOne('http://127.0.0.1:8000/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(new HttpParams().set('username', username).set('password', password).toString());
    expect(req.request.headers.get('Content-Type')).toBe('application/x-www-form-urlencoded');

    req.flush(mockResponse);
  });

  it('should make a GET request to request LCA data', () => {
    apiService.requestData().subscribe(data => {
      expect(data.length).toBe(2);
      expect(data).toEqual(mockLCAData);
    });

    const req = httpTestingController.expectOne('http://127.0.0.1:8000/data');
    expect(req.request.method).toBe('GET');

    req.flush(mockLCAData);
  });

  it('should handle a failed POST request for token', () => {
    const username = 'user';
    const password = 'password';

    apiService.requestToken(username, password).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpTestingController.expectOne('http://127.0.0.1:8000/login');
    expect(req.request.method).toBe('POST');

    req.flush(null, { status: 400, statusText: 'Bad Request' });
  });

  it('should handle a failed GET request for LCA data', () => {

    apiService.requestData().subscribe(
      () => {},
      error => {
        expect(error.status).toBe(500);
      }
    );

    const req = httpTestingController.expectOne('http://127.0.0.1:8000/data');
    expect(req.request.method).toBe('GET');


    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
  });
});
