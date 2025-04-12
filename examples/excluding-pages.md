# Cookies Consent JS

## Excluding pages from displaying the message

It is possible to specify a list of pages that will be excluded from showing the cookies consent message.

We only have to add the page in the array of denied pages.

```HTML
const cc = CookiesConsentJS({
    denylistPages : ["/policy", "/cookie-policy", "examples"],
    ...
});
```

Each item specified in the array will be compared with the URL and if it is contained, the page will be excluded of showing the message.

For instance, if we want to exclude the URL **/examples/cookiesconsentjs/example5.html**

```HTML
// Excludes only the page example5.html (the slash is not necessary)
denylistPages : ["/example5.html"];
```

```HTML
// Excludes all the examples section
denylistPages : ["/examples"];
```

```HTML
// Excludes all the cookies consent examples section
denylistPages : ["/examples/cookiesconsentjs"];
```