# Cookies Consent JS

## Associating cookie with Google Tag Manager

There is a cookie ready to be related to Google Tag Manager.

When using a Google Analytics cookie it is necessary to call the **cc-gtm.js** module before the main library.

```HTML
<script src="modules/cc-gtm.js"></script>
<script src="cookiesconsent.min.js"></script>
```

The key and name of the cookie must use the reserved name **cc_gtm**.

```HTML
cc_gtm: {
    name: "cc_gtm",
    title: "Google Tag Manager",
    description: "<p>Cookie description.</p>",
    code: "GTM-XXXXXXXX"  // Google Tag Manager code
}
```

We don not need to define any callback function to handle this kind of cookies. It will be enabled or disabled according to the user’s choice.

When using this kind of cookie, the Google Tag Manager scripts will be automatically inserted in the head of the page.

```HTML
<script async="" src="https://www.googletagmanager.com/gtm.js?id=GTM-XXXXXXX"></script>
<script>
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-XXXXXXX');
</script>
<noscript>
    <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-ML9NGWV" height="0" width="0" style="display:none;visibility:hidden"></iframe>
</noscript>
```

Google third party services are activated and deactivated by removing their scripts from the website according to the visitor’s choice but the data collecting settings of these services will depend on the administrator of the website from the google panels.

Example:

```HTML
const cc = CookiesConsentJS({
    ...
    cookies: {
        preferences: {
            name : "prefs",
            title : "Preference cookies",
            description : "<p>Lorem ipsum dolor sit amet consectetur adipiscing elit metus facilisis sociis.</p>",
            checked : true,
            disabled : true
        },
        profile: {
            name: "profile",
            title: "Profile cookies",
            description: "<p>Lorem ipsum dolor sit amet consectetur adipiscing elit metus facilisis sociis.</p>",
            checked: false
        }
        cc_gtm: {
            name: "cc_gtm",
            title: "Google Tag Manager",
            description: "<p>Cookie description.</p>",
            code: "GTM-XXXXXXXX"  // Google Tag Manager code
        }
    },
    ...
});
```