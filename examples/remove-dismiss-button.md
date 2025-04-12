# Cookies Consent JS

## Remove dismiss button and use a link to show the message

We can use a link to show the cookies consent window instead of the dismiss button or if we want to add a new way to show the window by using the showMessage() method.

```HTML
// Custom link to show cookies consent message
<a href="javascript:cc.showMessage()">Show cookies policy</a>
```

To not show the dismiss button we simply must not specify it in the list of buttons.

```HTML
const cc = CookiesConsentJS({
    buttons : ["settings", "info", "reject", "accept"], // without "dismiss"
    ...
});
```