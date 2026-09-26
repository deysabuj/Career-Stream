export interface SecurityCheckResult {
  isSecurityChallenge: boolean;
  challengeType?: string;
  reason?: string;
}

export class SecurityDetector {
  /**
   * Evaluates page HTML content, title, and response status to detect WAF, CAPTCHA, or login barriers.
   */
  public static detect(html: string, title: string = '', statusCode: number = 200): SecurityCheckResult {
    const lowerHtml = html.toLowerCase();
    const lowerTitle = title.toLowerCase();

    // 1. HTTP Status Rejections
    if (statusCode === 403) {
      return {
        isSecurityChallenge: true,
        challengeType: 'ACCESS_DENIED_403',
        reason: 'HTTP 403 Forbidden received from server.'
      };
    }
    if (statusCode === 401) {
      return {
        isSecurityChallenge: true,
        challengeType: 'UNAUTHORIZED_401',
        reason: 'HTTP 401 Unauthorized received from server.'
      };
    }

    // 2. Cloudflare Challenges
    if (
      lowerTitle.includes('just a moment...') ||
      lowerTitle.includes('attention required! | cloudflare') ||
      lowerHtml.includes('cf-browser-verification') ||
      lowerHtml.includes('cf-challenge-running') ||
      lowerHtml.includes('cloudflare ray id') ||
      lowerHtml.includes('enable cookies and reload the page')
    ) {
      return {
        isSecurityChallenge: true,
        challengeType: 'CLOUDFLARE_CHALLENGE',
        reason: 'Cloudflare bot protection / browser check detected.'
      };
    }

    // 3. CAPTCHA Challenges
    if (
      lowerHtml.includes('g-recaptcha') ||
      lowerHtml.includes('h-captcha') ||
      lowerHtml.includes('cf-turnstile') ||
      lowerHtml.includes('please verify you are a human') ||
      lowerHtml.includes('press & hold to confirm you are a human') ||
      lowerHtml.includes('bot detection') ||
      lowerHtml.includes('captcha-delivery')
    ) {
      return {
        isSecurityChallenge: true,
        challengeType: 'CAPTCHA_CHALLENGE',
        reason: 'CAPTCHA / Human verification challenge detected.'
      };
    }

    // 4. Akamai & Incapsula WAF
    if (
      lowerHtml.includes('access denied') ||
      lowerHtml.includes('you do not have permission to access') ||
      lowerHtml.includes('_incap_by_') ||
      lowerHtml.includes('akamai-bot-manager')
    ) {
      return {
        isSecurityChallenge: true,
        challengeType: 'WAF_CHALLENGE',
        reason: 'WAF / Bot manager access denial detected.'
      };
    }

    // 5. Authentication & SSO Walls
    if (
      lowerTitle.includes('sign in') ||
      lowerTitle.includes('login') ||
      lowerTitle.includes('single sign-on') ||
      (lowerHtml.includes('type="password"') && lowerHtml.includes('submit')) ||
      lowerHtml.includes('saml2/sso') ||
      lowerHtml.includes('oauth2/authorize')
    ) {
      return {
        isSecurityChallenge: true,
        challengeType: 'AUTHENTICATION_REQUIRED',
        reason: 'Login / SSO authentication wall detected.'
      };
    }

    return { isSecurityChallenge: false };
  }
}
