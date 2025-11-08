# BIMI Setup Guide

This guide will help you set up BIMI (Brand Indicators for Message Identification) so your profile picture appears next to emails sent from your domain.

## What is BIMI?

BIMI allows your brand logo (or profile picture) to appear next to authenticated emails in supported email clients like Gmail, Yahoo Mail, and FastMail. This enhances brand recognition and trust.

## Prerequisites

Before setting up BIMI, you need:

1. **SPF Record**: Sender Policy Framework record in your DNS
2. **DKIM**: DomainKeys Identified Mail authentication
3. **DMARC Policy**: Domain-based Message Authentication, Reporting, and Conformance
   - Must be set to `quarantine` or `reject` (not `none`)
   - Example: `v=DMARC1; p=quarantine; rua=mailto:dmarc@stevennassef.com`

## Files Created

The following files have been created in `public/.well-known/`:

- `bimi-logo.svg` - Your profile picture as a BIMI-compliant SVG (generated from profile.jpg)
- `bimi-selector.txt` - BIMI selector configuration
- `avatar.json` - Profile information for email clients
- `README.md` - Additional documentation

## Step 1: Generate BIMI SVG

The BIMI SVG has been generated automatically. If you update your profile picture, regenerate it:

```bash
npm run generate-bimi
```

This will:
- Read `public/profile/profile.jpg`
- Convert it to a base64-embedded SVG
- Save it to `public/.well-known/bimi-logo.svg`

## Step 2: Deploy to GitHub Pages

After committing and pushing your changes, the `.well-known` folder will be deployed to:
- `https://www.stevennassef.com/.well-known/bimi-logo.svg`

Verify the file is accessible by opening the URL in a browser.

## Step 3: Set Up DNS Records

### 3.1 DMARC Record (Required)

Add a DMARC TXT record to your domain's DNS:

```
Host: _dmarc.stevennassef.com
Type: TXT
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@stevennassef.com; ruf=mailto:dmarc@stevennassef.com
```

**Important**: BIMI requires DMARC policy to be `quarantine` or `reject`, not `none`.

### 3.2 BIMI DNS Record

Add a BIMI TXT record to your domain's DNS:

```
Host: default._bimi.stevennassef.com
Type: TXT
Value: v=BIMI1; l=https://www.stevennassef.com/.well-known/bimi-logo.svg;
```

**For Gmail** (requires VMC):
```
Host: default._bimi.stevennassef.com
Type: TXT
Value: v=BIMI1; l=https://www.stevennassef.com/.well-known/bimi-logo.svg; a=https://www.stevennassef.com/.well-known/vmc.pem;
```

**Note**: The `a=` parameter points to a Verified Mark Certificate (VMC), which is required for Gmail. See Step 4 for VMC setup.

## Step 4: Verified Mark Certificate (VMC) - Optional but Recommended

Gmail requires a VMC for your BIMI logo to display. A VMC:

- Verifies the authenticity of your logo
- May require your logo to be a registered trademark
- Is issued by a certificate authority (CA)

### VMC Providers

- **DigiCert**: https://www.digicert.com/bimi
- **Entrust**: https://www.entrust.com/bimi
- **Sectigo**: https://sectigo.com/bimi

### VMC Setup

1. Obtain a VMC from a provider
2. Upload the VMC certificate file to your server
3. Update the BIMI DNS record to include the `a=` parameter (see Step 3.2)

## Step 5: Verify Setup

### 5.1 Check SVG Accessibility

Visit: https://www.stevennassef.com/.well-known/bimi-logo.svg

The SVG should load and display your profile picture.

### 5.2 Verify DMARC

Use a DMARC checker tool:
- https://dmarcian.com/dmarc-inspector/
- https://mxtoolbox.com/dmarc.aspx

Enter your domain: `stevennassef.com`

### 5.3 Verify BIMI DNS Record

Use DNS lookup tools:
```bash
dig default._bimi.stevennassef.com TXT
```

Or use online tools:
- https://mxtoolbox.com/spf.aspx
- https://dnschecker.org/

### 5.4 Test Email

Send a test email from `contact@stevennassef.com` to:
- Gmail (requires VMC)
- Yahoo Mail
- FastMail
- Apple Mail (iOS 16+)

## Email Client Support

| Email Client | BIMI Support | VMC Required |
|-------------|--------------|--------------|
| Gmail       | ✅ Yes       | ✅ Yes       |
| Yahoo Mail  | ✅ Yes       | ❌ No        |
| FastMail    | ✅ Yes       | ❌ No        |
| Apple Mail  | ✅ Limited   | ❌ No        |
| Outlook     | ⚠️ Limited   | ❌ No        |
| Thunderbird | ❌ No        | ❌ No        |

## Troubleshooting

### Logo Not Appearing

1. **Check DMARC Policy**: Must be `quarantine` or `reject`
   ```bash
   dig _dmarc.stevennassef.com TXT
   ```

2. **Verify SVG Accessibility**: 
   - Must be accessible via HTTPS
   - Must be a valid SVG file
   - Check: https://www.stevennassef.com/.well-known/bimi-logo.svg

3. **Check BIMI DNS Record**:
   ```bash
   dig default._bimi.stevennassef.com TXT
   ```

4. **Wait for Propagation**: DNS changes can take up to 48 hours

5. **Check Email Client Support**: Not all clients support BIMI (see table above)

### SVG Validation

Validate your SVG using:
- https://bimi.entrust.com/validator/
- https://www.bimigroup.org/tools/

### Common Issues

**Issue**: "BIMI record not found"
- **Solution**: Verify the BIMI DNS record is correctly set

**Issue**: "DMARC policy not sufficient"
- **Solution**: Change DMARC policy from `none` to `quarantine` or `reject`

**Issue**: "SVG not accessible"
- **Solution**: Ensure the SVG is hosted on HTTPS and accessible publicly

**Issue**: "VMC required for Gmail"
- **Solution**: Obtain a VMC certificate and update the BIMI DNS record

## Additional Resources

- [BIMI Group](https://www.bimigroup.org/)
- [Gmail BIMI Documentation](https://support.google.com/a/answer/10903526)
- [DMARC Guide](https://dmarc.org/)
- [BIMI Validator](https://bimi.entrust.com/validator/)

## Maintenance

### Updating Your Profile Picture

1. Replace `public/profile/profile.jpg` with your new image
2. Run: `npm run generate-bimi`
3. Commit and push the updated `bimi-logo.svg`
4. Wait for deployment

### Renewing VMC

VMC certificates expire. Renew before expiration:
1. Contact your VMC provider
2. Obtain new certificate
3. Update the certificate file
4. Update BIMI DNS record if needed

## Notes

- BIMI is still relatively new and support varies by email client
- Gmail requires VMC for BIMI to work
- DNS changes can take 24-48 hours to propagate
- Test with multiple email clients to verify compatibility

