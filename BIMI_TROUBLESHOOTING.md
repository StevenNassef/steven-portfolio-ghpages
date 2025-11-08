# BIMI Troubleshooting Guide

## Issue: Logo Not Appearing in Emails

If your BIMI logo isn't appearing, check these requirements in order:

## ✅ Step 1: Fix BIMI DNS Record

**Current Issue**: Your `a=` parameter points to the SVG file, but it should either:
- **Option A (Recommended for non-Gmail)**: Remove the `a=` parameter entirely
- **Option B (For Gmail)**: Point to an actual VMC certificate file

### Correct BIMI Record (Without VMC - Works for Yahoo, FastMail, etc.)

```
Host: _bimi.default.stevennassef.com
Type: TXT
Value: v=BIMI1; l=https://www.stevennassef.com/.well-known/bimi-logo.svg;
```

**Important**: Remove the `a=` parameter if you don't have a VMC.

### Correct BIMI Record (With VMC - Required for Gmail)

```
Host: _bimi.default.stevennassef.com
Type: TXT
Value: v=BIMI1; l=https://www.stevennassef.com/.well-known/bimi-logo.svg; a=https://www.stevennassef.com/.well-known/vmc.pem;
```

## ✅ Step 2: Verify DMARC is Correctly Configured

BIMI **requires** DMARC to be set to `quarantine` or `reject`. It will **not work** if DMARC is `none` or missing.

### Check Your DMARC Record

```bash
dig _dmarc.stevennassef.com TXT
```

Or use: https://mxtoolbox.com/dmarc.aspx

### Required DMARC Configuration

```
Host: _dmarc.stevennassef.com
Type: TXT
Value: v=DMARC1; p=quarantine; rua=mailto:mail@stevennassef.com
```

**Critical**: 
- Must be `v=DMARC1` (NOT DMARC2)
- Policy must be `p=quarantine` or `p=reject` (NOT `p=none`)
- Without proper DMARC, BIMI will **never work**

## ✅ Step 3: Verify SPF and DKIM are Set Up

For DMARC to pass (which is required for BIMI), you need:

1. **SPF Record**: Authorizes which servers can send emails for your domain
2. **DKIM**: Adds a digital signature to your emails

### Check SPF

```bash
dig stevennassef.com TXT | grep spf
```

### Check DKIM

DKIM records are usually at: `selector._domainkey.stevennassef.com`

**If SPF or DKIM are missing**, your emails will fail DMARC, and BIMI won't work.

## ✅ Step 4: Verify SVG is Accessible

Test that your SVG is publicly accessible:

1. Open in browser: https://www.stevennassef.com/.well-known/bimi-logo.svg
2. The SVG should load and display your profile picture
3. Check that it's served over HTTPS (not HTTP)

## ✅ Step 5: Verify SVG is BIMI-Compliant

The SVG must meet BIMI requirements:

- ✅ Square dimensions (100x100 viewBox is good)
- ✅ Self-contained (no external references - our base64 embedding should work)
- ✅ Valid SVG format
- ✅ Accessible via HTTPS

### Validate Your SVG

Use BIMI validation tools:
- https://bimi.entrust.com/validator/
- https://www.bimigroup.org/tools/

## ✅ Step 6: Check Email Client Support

Not all email clients support BIMI:

| Email Client | Supports BIMI | VMC Required |
|-------------|---------------|--------------|
| Gmail       | ✅ Yes        | ✅ Yes       |
| Yahoo Mail  | ✅ Yes        | ❌ No        |
| FastMail    | ✅ Yes        | ❌ No        |
| Apple Mail  | ✅ Limited    | ❌ No        |
| Outlook     | ⚠️ Very Limited | ❌ No      |
| Thunderbird | ❌ No         | ❌ No        |

**For Gmail**: You **must** have a VMC (Verified Mark Certificate) for BIMI to work.

## ✅ Step 7: Verify Email Authentication

Your emails must **pass DMARC authentication** for BIMI to work.

### Check Email Headers

Send yourself a test email and check the headers:

1. Look for `Authentication-Results` header
2. Check that `dmarc=pass` appears
3. Verify `spf=pass` and `dkim=pass`

### If DMARC Fails

- BIMI will **not work** if DMARC fails
- Fix SPF/DKIM issues first
- Wait for DNS propagation (can take 24-48 hours)

## ✅ Step 8: Wait for DNS Propagation

DNS changes can take time to propagate:

- TTL of 14400 seconds = 4 hours
- Full propagation can take 24-48 hours
- Use https://dnschecker.org/ to verify globally

## Common Issues and Solutions

### Issue 1: "Logo not showing in Gmail"

**Cause**: Gmail requires a VMC (Verified Mark Certificate)

**Solution**: 
- Obtain a VMC from a provider (DigiCert, Entrust, Sectigo)
- Upload VMC file to your server
- Update BIMI record with `a=` parameter pointing to VMC

**Alternative**: Test with Yahoo Mail or FastMail (don't require VMC)

### Issue 2: "Logo not showing in any client"

**Possible Causes**:
1. DMARC policy is `none` or missing → **Fix DMARC**
2. SPF/DKIM not configured → **Fix SPF/DKIM**
3. Email not passing DMARC → **Check email headers**
4. SVG not accessible → **Verify URL works**
5. BIMI record incorrect → **Fix DNS record**

### Issue 3: "DMARC fails"

**Causes**:
- SPF not configured correctly
- DKIM not configured correctly
- Email sent from unauthorized server

**Solution**: 
- Verify SPF record includes your email server
- Verify DKIM is signing emails correctly
- Check email server configuration

### Issue 4: "SVG not loading"

**Causes**:
- File not deployed to GitHub Pages
- Incorrect URL
- CORS issues
- HTTPS not working

**Solution**:
- Verify file exists at: https://www.stevennassef.com/.well-known/bimi-logo.svg
- Check GitHub Pages deployment
- Verify SSL certificate is valid

## Testing Checklist

- [ ] BIMI DNS record is correct (no `a=` parameter unless you have VMC)
- [ ] DMARC record exists and is set to `quarantine` or `reject`
- [ ] SPF record is configured
- [ ] DKIM is configured and signing emails
- [ ] SVG is accessible at the URL in BIMI record
- [ ] SVG is BIMI-compliant
- [ ] Email passes DMARC authentication
- [ ] Testing with supported email client (Yahoo, FastMail, or Gmail with VMC)
- [ ] Waited for DNS propagation (24-48 hours)

## Quick Test Commands

```bash
# Check BIMI record
dig _bimi.default.stevennassef.com TXT

# Check DMARC record
dig _dmarc.stevennassef.com TXT

# Check SPF record
dig stevennassef.com TXT | grep spf

# Test SVG accessibility
curl -I https://www.stevennassef.com/.well-known/bimi-logo.svg
```

## Next Steps

1. **Fix BIMI DNS record**: Remove or correct the `a=` parameter
2. **Verify DMARC**: Ensure it's set to `quarantine` or `reject`
3. **Check SPF/DKIM**: Ensure they're configured correctly
4. **Test SVG**: Verify it's accessible
5. **Send test email**: Check email headers for DMARC pass
6. **Wait**: Allow 24-48 hours for DNS propagation
7. **Test**: Try with Yahoo Mail or FastMail first (easier than Gmail)

## Resources

- [BIMI Group](https://www.bimigroup.org/)
- [BIMI Validator](https://bimi.entrust.com/validator/)
- [DMARC Inspector](https://dmarcian.com/dmarc-inspector/)
- [MXToolbox DMARC Check](https://mxtoolbox.com/dmarc.aspx)

