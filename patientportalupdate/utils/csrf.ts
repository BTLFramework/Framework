// CSRF Protection Utility

const CSRF_TOKEN_KEY = 'btl_csrf_token'

export class CSRFProtection {
  private static token: string | null = null

  // Generate a new CSRF token
  static generateToken(): string {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    this.token = token
    localStorage.setItem(CSRF_TOKEN_KEY, token)
    return token
  }

  // Get the current CSRF token
  static getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem(CSRF_TOKEN_KEY)
    }
    return this.token
  }

  // Validate a CSRF token
  static validateToken(token: string): boolean {
    const storedToken = this.getToken()
    return storedToken === token
  }

  // Clear the CSRF token
  static clearToken(): void {
    this.token = null
    localStorage.removeItem(CSRF_TOKEN_KEY)
  }

  // Add CSRF token to headers
  static getHeaders(): Record<string, string> {
    const token = this.getToken()
    return {
      'Content-Type': 'application/json',
      'X-CSRF-Token': token || '',
    }
  }

  // Secure fetch wrapper with CSRF protection
  static async secureFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const headers = {
      ...this.getHeaders(),
      ...options.headers,
    }

    return fetch(url, {
      ...options,
      headers,
    })
  }
}

// Initialize CSRF token on app startup
if (typeof window !== 'undefined') {
  CSRFProtection.generateToken()
} 