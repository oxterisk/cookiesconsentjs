# Cookies Consent JS

## Associating cookie with Google Analytics

There is a cookie ready to be related to Google Analytics.

When using a Google Analytics cookie it is necessary to call the **cc-ga.js** module before the main library.

```HTML
<script src="modules/cc-ga.js"></script>
<script src="cookiesconsent.min.js"></script>
```

The key and name of the cookie must use the reserved name **cc_ga**.

```HTML
cc_ga: {
    name: "cc_ga",
    title: "Google Analytics",
    description: "<p>Cookie description.</p>",
    code: "G-XXXXXXXX"  // Google Analytics code
}
```

We don not need to define any callback function to handle this kind of cookies. It will be enabled or disabled according to the user’s choice.

When using this kind of cookie, the Google Analytics scripts will be automatically inserted in the head of the page.

```HTML
<script src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX" async=""></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXX', { 'anonymize_ip': true });
    gtag('config', 'G-XXXXXXXX');
    window['ga-disable-' + 'G-XXXXXXXX'] = true;
</script>
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
        cc_ga: {
            name: "cc_ga",
            title: "Google Analytics",
            description: "<p>Cookie description.</p>",
            code: "G-XXXXXXXX"  // Google Analytics code
        }
    },
    ...
});
```