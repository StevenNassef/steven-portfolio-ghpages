# .well-known Directory

This directory contains configuration files for email clients and web services.

## Files

### `bimi-logo.svg`
SVG logo for BIMI (Brand Indicators for Message Identification). This logo can appear next to authenticated emails in supported email clients.

### `bimi-selector.txt`
BIMI selector configuration file.

### `avatar.json`
Profile picture and contact information for email clients that support this format.

## BIMI Setup

To enable BIMI for your domain, you need:

1. **DMARC Policy**: Set up DMARC authentication for your domain (stevennassef.com)
   - Add a DMARC TXT record in your DNS
   - Example: `v=DMARC1; p=quarantine; rua=mailto:dmarc@stevennassef.com`

2. **BIMI DNS Record**: Add a BIMI TXT record to your DNS
   - Selector: `default`
   - Location: `_bimi.default.stevennassef.com`
   - Value: `v=BIMI1; l=https://www.stevennassef.com/.well-known/bimi-logo.svg; a=https://www.stevennassef.com/.well-known/bimi-logo.svg;`

3. **SVG Logo**: The SVG file must:
   - Be accessible via HTTPS
   - Follow BIMI SVG requirements (square, certain dimensions)
   - Be verified (may require VMC certificate for some email providers)

## Email Client Support

- **Gmail**: Requires VMC (Verified Mark Certificate) for BIMI
- **Yahoo Mail**: Supports BIMI
- **FastMail**: Supports BIMI
- **Apple Mail**: Limited support (iOS 16+)
- **Outlook**: Limited support

## Testing

1. Verify the SVG is accessible: https://www.stevennassef.com/.well-known/bimi-logo.svg
2. Check DMARC policy: Use tools like https://dmarcian.com/dmarc-inspector/
3. Verify BIMI DNS record: Use `dig _bimi.default.stevennassef.com TXT`

## Alternative: Profile Picture in Email Clients

Some email clients also support fetching profile pictures from:
- Gravatar (based on email hash)
- Social media profiles (LinkedIn, etc.)
- Domain-specific endpoints

The `avatar.json` file provides a standard way for clients to discover your profile picture.

