import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class HttpProviderService {
  baseUrl: any = environment.baseURL

  constructor(private http:HttpClient) { }


    get(endpoint: string, params?: HttpParams) {
      return this.http.get(this.baseUrl+endpoint, { params })
        .pipe(catchError(this.handleError));
    }


    post(endpoint: string, body: any, options?: { headers?: HttpHeaders, params?: HttpParams }) {
      return this.http.post(this.baseUrl+endpoint, body,options)
        .pipe(catchError(this.handleError));
    }


    put(endpoint: string, body: any, options?: { headers?: HttpHeaders, params?: HttpParams }) {
      return this.http.put(this.baseUrl+endpoint, body, options)
        .pipe(catchError(this.handleError));
    }


    delete(endpoint: string, options?: { headers?: HttpHeaders, params?: HttpParams }) {
      return this.http.delete(this.baseUrl+endpoint, options)
        .pipe(catchError(this.handleError));
    }

    /**
    * Method to handle errors.
    * @param error : Error from API response
    */
    private handleError(error: HttpErrorResponse): Observable<never> {
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Client-side error: ${error.error.message}`;
      } else {
        // Server-side error
        errorMessage = `Server-side error: ${error.status} ${error.message}`;
      }
      // Here you can add additional logging if needed
      console.error(errorMessage);
      return throwError(() => new Error(errorMessage));
    }
}
