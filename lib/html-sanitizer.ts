import DOMPurify from 'isomorphic-dompurify';

// Trusted CDN domains for external resources
const ALLOWED_SCRIPT_DOMAINS = [
  'cdn.tailwindcss.com',
  'unpkg.com',
  'cdn.jsdelivr.net',
  'cdnjs.cloudflare.com'
];

const ALLOWED_IMAGE_DOMAINS = [
  'static.photos',
  'via.placeholder.com',
  'picsum.photos',
  'images.unsplash.com'
];

// Dangerous JavaScript APIs to block
const DANGEROUS_APIS = [
  'fetch(',
  'XMLHttpRequest',
  'navigator.geolocation',
  'navigator.camera',
  'navigator.microphone',
  'window.parent',
  'window.top',
  'postMessage',
  'eval(',
  'Function(',
  'setTimeout(',
  'setInterval(',
  'localStorage',
  'sessionStorage',
  'indexedDB',
  'document.cookie',
  'navigator.clipboard',
  'crypto.subtle'
];

interface SanitizationResult {
  sanitizedHtml: string;
  warnings: string[];
  blocked: string[];
}

export class HTMLSanitizer {
  
  /**
   * Sanitize AI-generated HTML for safe execution
   */
  static sanitize(html: string): SanitizationResult {
    const warnings: string[] = [];
    const blocked: string[] = [];
    
    // Step 1: Basic HTML sanitization with DOMPurify
    let sanitizedHtml = DOMPurify.sanitize(html, {
      WHOLE_DOCUMENT: true,
      ALLOWED_TAGS: [
        'html', 'head', 'body', 'title', 'meta', 'link', 'style', 'script',
        'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'a', 'img', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th',
        'form', 'input', 'button', 'textarea', 'select', 'option',
        'nav', 'header', 'footer', 'main', 'section', 'article', 'aside',
        'canvas', 'svg', 'video', 'audio', 'iframe'
      ],
      ALLOWED_ATTR: [
        'class', 'id', 'style', 'src', 'href', 'alt', 'title', 'type',
        'name', 'value', 'placeholder', 'data-*', 'aria-*', 'role',
        'width', 'height', 'controls', 'autoplay', 'loop', 'muted'
      ]
    });

    // Step 2: Validate and filter external script sources
    sanitizedHtml = this.sanitizeScriptSources(sanitizedHtml, warnings, blocked);

    // Step 3: Validate image sources
    sanitizedHtml = this.sanitizeImageSources(sanitizedHtml, warnings, blocked);

    // Step 4: Remove dangerous JavaScript APIs
    sanitizedHtml = this.sanitizeJavaScript(sanitizedHtml, warnings, blocked);

    // Step 5: Inject security headers and restrictions
    sanitizedHtml = this.injectSecurityMeasures(sanitizedHtml);

    return {
      sanitizedHtml,
      warnings,
      blocked
    };
  }

  /**
   * Validate and sanitize script sources
   */
  private static sanitizeScriptSources(html: string, warnings: string[], blocked: string[]): string {
    return html.replace(/<script[^>]*src\s*=\s*["']([^"']+)["'][^>]*>/gi, (match, src) => {
      const url = new URL(src, 'https://example.com');
      const domain = url.hostname;
      
      if (ALLOWED_SCRIPT_DOMAINS.some(allowed => domain.includes(allowed))) {
        warnings.push(`External script allowed: ${domain}`);
        return match;
      } else {
        blocked.push(`Blocked untrusted script: ${domain}`);
        return `<!-- BLOCKED SCRIPT: ${src} -->`;
      }
    });
  }

  /**
   * Validate and sanitize image sources
   */
  private static sanitizeImageSources(html: string, warnings: string[], blocked: string[]): string {
    return html.replace(/<img[^>]*src\s*=\s*["']([^"']+)["'][^>]*>/gi, (match, src) => {
      // Allow data URLs and relative URLs
      if (src.startsWith('data:') || src.startsWith('/') || src.startsWith('./')) {
        return match;
      }

      try {
        const url = new URL(src);
        const domain = url.hostname;
        
        if (ALLOWED_IMAGE_DOMAINS.some(allowed => domain.includes(allowed))) {
          warnings.push(`External image allowed: ${domain}`);
          return match;
        } else {
          blocked.push(`Blocked untrusted image: ${domain}`);
          return `<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='100'%3E%3Crect width='200' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23666'%3EImage Blocked%3C/text%3E%3C/svg%3E" alt="Blocked image: ${domain}" />`;
        }
      } catch {
        blocked.push(`Blocked invalid image URL: ${src}`);
        return `<!-- BLOCKED IMAGE: Invalid URL -->`;
      }
    });
  }

  /**
   * Remove or replace dangerous JavaScript APIs
   */
  private static sanitizeJavaScript(html: string, warnings: string[], blocked: string[]): string {
    let sanitized = html;

    // Check for dangerous APIs in script tags
    const scriptMatches = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
    if (scriptMatches) {
      scriptMatches.forEach(scriptTag => {
        DANGEROUS_APIS.forEach(api => {
          if (scriptTag.includes(api)) {
            warnings.push(`Potentially dangerous API detected: ${api}`);
            // Replace dangerous APIs with safe alternatives or remove them
            sanitized = sanitized.replace(scriptTag, this.sanitizeScriptContent(scriptTag, api, blocked));
          }
        });
      });
    }

    return sanitized;
  }

  /**
   * Sanitize individual script content
   */
  private static sanitizeScriptContent(scriptTag: string, dangerousApi: string, blocked: string[]): string {
    let sanitized = scriptTag;

    // Block specific dangerous patterns
    const replacements: Record<string, string> = {
      'fetch(': '// fetch() blocked for security',
      'XMLHttpRequest': '// XMLHttpRequest blocked for security',
      'navigator.geolocation': '// geolocation blocked for security',
      'window.parent': '// parent window access blocked',
      'window.top': '// top window access blocked',
      'postMessage': '// postMessage blocked for security',
      'eval(': '// eval() blocked for security',
      'localStorage': '// localStorage access blocked',
      'sessionStorage': '// sessionStorage access blocked',
      'document.cookie': '// cookie access blocked'
    };

    Object.entries(replacements).forEach(([api, replacement]) => {
      if (sanitized.includes(api)) {
        blocked.push(`Blocked dangerous API: ${api}`);
        sanitized = sanitized.replace(new RegExp(api.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement);
      }
    });

    return sanitized;
  }

  /**
   * Inject security measures into HTML
   */
  private static injectSecurityMeasures(html: string): string {
    // Content Security Policy
    const csp = `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' ${ALLOWED_SCRIPT_DOMAINS.join(' ')}; style-src 'self' 'unsafe-inline' ${ALLOWED_SCRIPT_DOMAINS.join(' ')}; img-src 'self' data: ${ALLOWED_IMAGE_DOMAINS.join(' ')}; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self';">`;
    
    // Security blocking script
    const securityScript = `
    <script>
      // Block dangerous APIs at runtime
      (function() {
        'use strict';
        
        // Override fetch
        if (typeof fetch !== 'undefined') {
          window.fetch = function() {
            console.warn('🛡️ Network requests blocked by security policy');
            return Promise.reject(new Error('Network requests blocked for security'));
          };
        }
        
        // Block XMLHttpRequest
        window.XMLHttpRequest = function() {
          console.warn('🛡️ XMLHttpRequest blocked by security policy');
          throw new Error('XMLHttpRequest blocked for security');
        };
        
        // Block WebSocket
        window.WebSocket = function() {
          console.warn('🛡️ WebSocket blocked by security policy');
          throw new Error('WebSocket blocked for security');
        };
        
        // Block parent window access
        try {
          Object.defineProperty(window, 'parent', {
            get: function() {
              console.warn('🛡️ Parent window access blocked by security policy');
              return window;
            },
            configurable: false
          });
        } catch(e) {}
        
        // Block localStorage access
        try {
          Object.defineProperty(window, 'localStorage', {
            get: function() {
              console.warn('🛡️ localStorage access blocked by security policy');
              return {};
            },
            configurable: false
          });
        } catch(e) {}
        
        // Block sessionStorage access
        try {
          Object.defineProperty(window, 'sessionStorage', {
            get: function() {
              console.warn('🛡️ sessionStorage access blocked by security policy');
              return {};
            },
            configurable: false
          });
        } catch(e) {}
        
        console.log('🛡️ Security sandbox initialized');
      })();
    </script>`;

    // Inject security measures into head
    if (html.includes('<head>')) {
      return html.replace('<head>', `<head>${csp}${securityScript}`);
    } else if (html.includes('<html>')) {
      return html.replace('<html>', `<html><head>${csp}${securityScript}</head>`);
    } else {
      return `<head>${csp}${securityScript}</head>${html}`;
    }
  }

  /**
   * Generate security report
   */
  static generateSecurityReport(result: SanitizationResult): string {
    const { warnings, blocked } = result;
    
    let report = '🛡️ Security Scan Results:\n';
    
    if (warnings.length === 0 && blocked.length === 0) {
      report += '✅ No security issues detected\n';
    } else {
      if (warnings.length > 0) {
        report += `\n⚠️ Warnings (${warnings.length}):\n`;
        warnings.forEach(warning => report += `  • ${warning}\n`);
      }
      
      if (blocked.length > 0) {
        report += `\n🚫 Blocked (${blocked.length}):\n`;
        blocked.forEach(blocked => report += `  • ${blocked}\n`);
      }
    }
    
    return report;
  }
} 