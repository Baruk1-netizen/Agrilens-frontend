// Google Authentication Service
declare global {
  interface Window {
    google: any;
    googleOneTap: any;
  }
}

export interface GoogleUser {
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  sub: string; // Google ID
}

export interface GoogleAuthResponse {
  credential: string;
  select_by?: string;
}

export class GoogleAuthService {
  private static instance: GoogleAuthService;
  private isInitialized = false;
  private clientId: string;

  private constructor() {
    // Get Google OAuth Client ID from environment variables only
    this.clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
    
    if (!this.clientId) {
      console.error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set in environment variables');
      throw new Error('Google Client ID is required but not configured');
    }
  }

  public static getInstance(): GoogleAuthService {
    if (!GoogleAuthService.instance) {
      GoogleAuthService.instance = new GoogleAuthService();
    }
    return GoogleAuthService.instance;
  }

  // Initialize Google Identity Services
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    return new Promise((resolve, reject) => {
      // Load Google Identity Services script
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        if (window.google) {
          window.google.accounts.id.initialize({
            client_id: this.clientId,
            callback: () => {}, // Will be set per-use
            auto_select: false,
            cancel_on_tap_outside: true,
          });
          this.isInitialized = true;
          resolve();
        } else {
          reject(new Error('Google Identity Services failed to load'));
        }
      };

      script.onerror = () => {
        reject(new Error('Failed to load Google Identity Services'));
      };

      document.head.appendChild(script);
    });
  }

  // Sign in with Google using OAuth popup with account chooser
  public async signInWithPopup(): Promise<string> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Directly show the Google account selection modal
    return this.useGoogleIdentityWithAccountSelection();
  }

  // OAuth 2.0 popup flow for account chooser
  private async showGoogleOAuthPopup(): Promise<string> {
    return new Promise((resolve, reject) => {
      // OAuth 2.0 popup parameters
      const params = new URLSearchParams({
        client_id: this.clientId,
        redirect_uri: window.location.origin,
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline',
        prompt: 'select_account', // This forces the account chooser
        state: 'google_oauth_' + Math.random().toString(36).substring(2)
      });

      const authUrl = `https://accounts.google.com/oauth/authorize?${params.toString()}`;
      
      // Open popup window
      const popup = window.open(
        authUrl,
        'google-auth',
        'width=500,height=600,left=' + 
        (window.screen.width / 2 - 250) + ',top=' + 
        (window.screen.height / 2 - 300) + 
        ',resizable=yes,scrollbars=yes,status=yes'
      );

      if (!popup) {
        reject(new Error('Popup was blocked. Please allow popups and try again.'));
        return;
      }

      // Alternative: Use the Google Identity Services with better account selection
      this.useGoogleIdentityWithAccountSelection()
        .then(resolve)
        .catch(() => {
          // Fallback: Show a message to user about manual auth
          popup.close();
          reject(new Error('Please use the "Continue with Google" button and select your account.'));
        });
    });
  }

  // Use Google Identity Services with account selection
  // Use Google Identity Services with account selection - shows white modal
  private async useGoogleIdentityWithAccountSelection(): Promise<string> {
    return new Promise((resolve, reject) => {
      // Create a temporary container for Google account selection
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.top = '50%';
      container.style.left = '50%';
      container.style.transform = 'translate(-50%, -50%)';
      container.style.zIndex = '10001';
      container.style.background = 'white';
      container.style.padding = '30px';
      container.style.borderRadius = '12px';
      container.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
      container.style.textAlign = 'center';
      container.style.fontFamily = 'system-ui, sans-serif';
      container.style.minWidth = '320px';

      // Add overlay
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      overlay.style.zIndex = '10000';

      // Add title
      const title = document.createElement('h3');
      title.textContent = 'Choose your Google account';
      title.style.margin = '0 0 20px 0';
      title.style.color = '#333';
      title.style.fontSize = '18px';
      title.style.fontWeight = '500';
      container.appendChild(title);

      // Button container for Google sign-in
      const buttonDiv = document.createElement('div');
      buttonDiv.style.marginBottom = '20px';
      container.appendChild(buttonDiv);

      // Close button
      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'Cancel';
      closeBtn.style.padding = '10px 20px';
      closeBtn.style.border = '1px solid #ddd';
      closeBtn.style.borderRadius = '6px';
      closeBtn.style.background = '#f8f9fa';
      closeBtn.style.cursor = 'pointer';
      closeBtn.style.fontSize = '14px';
      closeBtn.style.color = '#666';
      closeBtn.style.transition = 'background-color 0.2s';
      
      closeBtn.onmouseover = () => {
        closeBtn.style.background = '#e9ecef';
      };
      closeBtn.onmouseout = () => {
        closeBtn.style.background = '#f8f9fa';
      };
      
      closeBtn.onclick = () => {
        document.body.removeChild(overlay);
        document.body.removeChild(container);
        reject(new Error('User cancelled Google sign-in'));
      };
      container.appendChild(closeBtn);

      // Add overlay click to close
      overlay.onclick = (e) => {
        if (e.target === overlay) {
          document.body.removeChild(overlay);
          document.body.removeChild(container);
          reject(new Error('User cancelled Google sign-in'));
        }
      };

      document.body.appendChild(overlay);
      document.body.appendChild(container);

      // Initialize Google Identity Services for account selection
      window.google.accounts.id.initialize({
        client_id: this.clientId,
        callback: (response: GoogleAuthResponse) => {
          // Clean up modal
          document.body.removeChild(overlay);
          document.body.removeChild(container);
          resolve(response.credential);
        },
        auto_select: false, // Force account chooser
        use_fedcm_for_prompt: false, // Disable FedCM
        cancel_on_tap_outside: false, // Prevent accidental dismissal
      });

      // Render the Google sign-in button with account selection
      window.google.accounts.id.renderButton(buttonDiv, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: 280,
      });

      // Also try to show the Google prompt for account selection
      // This will show the native Google account chooser if available
      setTimeout(() => {
        try {
          window.google.accounts.id.prompt((notification: any) => {
            // This handles the native Google account chooser
            if (notification.isSkippedMoment() || notification.isNotDisplayed()) {
              // If native prompt fails, the rendered button above will handle it
              console.log('Native Google prompt not available, using button interface');
            }
          });
        } catch (error) {
          console.log('Native Google prompt error:', error);
          // Button interface will still work
        }
      }, 100);
    });
  }

  // Parse JWT token from Google
  private parseJwtToken(token: string): GoogleUser {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const payload = JSON.parse(jsonPayload);
      
      return {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        given_name: payload.given_name,
        family_name: payload.family_name,
        sub: payload.sub,
      };
    } catch (error) {
      throw new Error('Invalid JWT token');
    }
  }

  // Sign out (if needed)
  public signOut(): void {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.disableAutoSelect();
    }
  }
}

// Export singleton instance
export const googleAuth = GoogleAuthService.getInstance();
