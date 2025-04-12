# Cookies Consent JS

## Callback functions

Callback functions allow us to control the actions that must be executed after the different events depending on the state of the cookies.

There are 4 differents events: first_load, accept, reject and load.

We can create a JavaScript file to gather all the functions and reference it before the main script.

```HTML
<script src="cc-callback.js"></script>
<script src="cookiesconsent.min.js"></script>
```

First of all we have to define what function will be executed for every event.

```HTML
const cc = CookiesConsentJS({
    ...
    content: {
        ...
    },
    cookies: {
        preferences: {
            name: "prefs",
            ...
        },
        statistics: {
            name: "stats",
            ...
        }
    },
    callback : {
        first_load : "welcome",  // first access to the page (no cookies defined)
        accept : "enableServices",  // after clicking accept all and accept settings buttons
        reject : "disableServices",  // after clicking reject all button
        load : "checkServices",  // every time the user accesses to the page (except the first time)
    }
});
```

```HTML
// cc-callback.js

function enableServices( params = "" ) {
    console.log( "Enable all services!" );
    console.log( params );
}

function disableServices( params = "" ) {
    console.log( "Disable services!" );
    console.log( params );
}

function checkServices( params = "" ) {
    console.log( "Welcome back to the page!" );
    console.log( params );

    if ( params.hasOwnProperty( "stats" ) && params.stats )
        console.log( "We can activate the analytics code!" );
    else
        console.log( "Disable analytics code" );

    if ( params.hasOwnProperty( "prefs" ) && params.prefs )
        console.log( "We can activate preferences cookies!" );
    else
        console.log( "Disable preferences cookies" );
}

function welcome( params = "" ) {
    console.log( "Welcome to the page!" );
    console.log( params );
}
```

In this example we will define an action for every event. You can open the development tools console of your browser to see the value of the parameters and console messages after every action.