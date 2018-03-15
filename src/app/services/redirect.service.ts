import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

@Injectable()
export class RedirectService {

  getRedirectURLFromResponseHeader(response: Response): string {
    let url;
    try {
      url = response.headers.get('redirecturl');
    } catch (e) {
      // TODO log error message instead of console.log
      console.log('RedirectURL parameter is not available in the response header');
    }
    return url;
  }

  redirectToLogin(): void {
    const pathArray = location.href.split( '/' );
    const protocol = pathArray[0];
    const host = pathArray[2];
    const baseUrl = protocol + '//' + host;
    // const returnURL = baseUrl + '/recon/';
    // const returnURLEncoded = window.btoa(returnURL);

    window.location.href = baseUrl + '/login';
  }

  redirectToStart(redirect): void {
    if (redirect) {
      const pathArray = location.href.split( '/' );
      const protocol = pathArray[0];
      const host = pathArray[2];
      const baseUrl = protocol + '//' + host;
      window.location.href = baseUrl + '/recon-services/login.jsp';
    }
  }

  redirectToReconApp() {
    window.location.href = (window.location.href).replace(window.location.pathname, '/recon/');
  }
}
