# Pro Studios — Hostinger upload

This is the static website. It does not need Node.js.

## Upload

1. On this GitHub page, click **Code**, then **Download ZIP**.
2. In Hostinger hPanel, open **Websites → Manage → File Manager → public_html**.
3. Upload the zip and extract it.
4. Open the extracted folder (`pro-studios-site-main`) and move everything inside it up into `public_html`.
5. `index.html` must be directly inside `public_html`, then open your domain.

When the Google Apps Script URL is ready, edit `site.js` and set `SHEETS_WEB_APP_URL`.
