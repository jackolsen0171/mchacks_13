# Progressive Web App (PWA) Setup Guide

This project has been configured as a Progressive Web App (PWA) with support for Chrome Desktop, Safari Mobile, Android Chrome Mobile, and other modern browsers.

## What's Included

### 1. **manifest.json**
- Web App manifest with metadata for app installation
- Defines app name, icons, colors, and display mode
- Includes app shortcuts for quick access to Upload and Study pages
- Screenshots for the app store installations

### 2. **Service Worker (sw.js)**
- Handles offline functionality with network-first strategy
- Caches essential assets for faster loading
- Provides offline fallback page
- Automatically manages cache versioning

### 3. **Updated HTML Head Tags (app.html)**
- Apple Mobile Web App meta tags for iOS support
- Microsoft Tile configuration for Windows
- Open Graph meta tags for social media sharing
- Twitter Card meta tags for Twitter sharing
- Theme color configuration for browser UI

### 4. **Browser Configuration**
- `browserconfig.xml`: Windows tile configuration
- Favicon links for various platforms

### 5. **Icon Assets**
SVG icons have been created in `/static/icons/`:
- `icon-192x192.svg` - Standard icon (192x192)
- `icon-512x512.svg` - Large icon (512x512)
- `icon-maskable-192x192.svg` - Maskable icon for adaptive display (192x192)
- `icon-maskable-512x512.svg` - Maskable icon for adaptive display (512x512)

## Converting SVG Icons to PNG

To use the PWA with proper icon display, you need to convert the SVG icons to PNG format.

### Option 1: Using ImageMagick (Recommended)

```bash
bash generate-pwa-icons.sh
```

This script will automatically convert all SVG icons to PNG format.

**Installation:**
- **Ubuntu/Debian:** `sudo apt-get install imagemagick`
- **macOS:** `brew install imagemagick`
- **Windows:** Download from [ImageMagick Official Site](https://imagemagick.org/script/download.php#windows)

### Option 2: Using Online Tools

Upload SVG files to tools like:
- [CloudConvert](https://cloudconvert.com/)
- [Convertio](https://convertio.co/)
- [OnlineConvertFree](https://onlineconvertfree.com/)

Save the converted PNG files to `/web/static/icons/`

### Option 3: Using Design Software

- Adobe Illustrator
- Inkscape (Free)
- GIMP

## Browser Support

### Chrome Desktop
- Install PWA from address bar menu
- Supports all features including shortcuts and offline functionality

### Safari Mobile (iOS)
- Add to Home Screen via Share menu
- Displays app name and icon
- Supports splash screens (via apple-touch-icon)
- Status bar styling with `apple-mobile-web-app-status-bar-style`

### Android Chrome Mobile
- Install PWA from app menu or banner
- Full support for manifest features
- Adaptive icon display with maskable icons
- Shortcuts available from app launcher

### Other Browsers
- Firefox (Mobile & Desktop): Full support
- Edge: Full support
- Samsung Internet: Full support
- Opera: Full support

## Key PWA Features Enabled

1. **Standalone Display**: Opens as a native app without browser chrome
2. **Custom Theme Colors**: Branded color scheme for address bar and UI
3. **App Shortcuts**: Quick access to upload and study pages
4. **Offline Support**: Basic offline functionality via service worker
5. **Icon Display**: Multiple icon sizes and adaptive icons for different platforms
6. **Social Media Integration**: Open Graph and Twitter Card support

## Testing the PWA

### Chrome DevTools Inspection
1. Open DevTools (F12)
2. Go to **Application** tab
3. Check:
   - **Manifest** section: Verify manifest.json is loaded
   - **Service Workers** section: Verify service worker is registered
   - **Storage** section: Check cached files

### Install Options
1. **Chrome Desktop**: Click the install icon in the address bar
2. **Safari iOS**: Share menu → Add to Home Screen
3. **Android Chrome**: Menu → Install app

### Lighthouse Audit
1. Open DevTools → Lighthouse
2. Select "PWA" category
3. Run audit to identify any issues

## Customization

### Update App Colors
Edit `static/manifest.json`:
```json
"theme_color": "#6366f1",      // Browser UI color
"background_color": "#ffffff"   // App launch background
```

### Update App Name
Edit `static/manifest.json`:
```json
"name": "Adaptive Study",
"short_name": "Study"
```

### Update Icons
Replace SVG files in `/static/icons/` with your custom designs, then run the icon generation script.

### Update Service Worker Cache
Edit `static/sw.js` and update `CACHE_NAME`:
```javascript
const CACHE_NAME = 'adaptive-study-v2'; // Increment version number
```

## File Structure

```
web/
├── src/
│   └── app.html                    # Updated with PWA meta tags
├── static/
│   ├── manifest.json               # PWA manifest
│   ├── sw.js                       # Service Worker
│   ├── browserconfig.xml           # Windows tile config
│   └── icons/
│       ├── icon-192x192.svg
│       ├── icon-512x512.svg
│       ├── icon-maskable-192x192.svg
│       └── icon-maskable-512x512.svg
└── generate-pwa-icons.sh          # Icon generation script
```

## Deployment Notes

1. Ensure HTTPS is enabled on your production server (required for PWA)
2. Serve manifest.json with correct MIME type: `application/manifest+json`
3. Service Worker requires HTTPS to function
4. Test on actual devices/browsers before releasing

## Additional Resources

- [PWA Documentation - MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web App Manifest Spec](https://www.w3.org/TR/appmanifest/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [PWA Checklist](https://web.dev/pwa-checklist/)

## Troubleshooting

### Service Worker Not Registering
- Ensure website uses HTTPS
- Check browser console for errors
- Verify `sw.js` is in the root `static/` directory

### Icons Not Displaying
- Verify PNG files exist (convert SVG to PNG)
- Check manifest.json paths are correct
- Use absolute paths starting with `/`

### Offline Functionality Not Working
- Check Service Worker status in DevTools
- Verify cache names match in `sw.js` and manifest
- Test in incognito/private mode to avoid cache conflicts

---

**Branch:** `feature/pwa`  
**Last Updated:** January 2026
