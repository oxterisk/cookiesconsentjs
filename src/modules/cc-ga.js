function addGoogleAnalyticsScript({ code = "", onLoad = false }) {

    if ( code != '' ) {

        let script = document.createElement( "script" );
        script.src = `https://www.googletagmanager.com/gtag/js?id=${code}`;
        script.async = true;

        document.head.appendChild( script );

        script = document.createElement( "script" );
        script.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${code}', { 'anonymize_ip': true });
            gtag('config', '${code}');
            window['ga-disable-' + '${code}'] = true;`;

        document.head.appendChild( script );

        if ( onLoad )
            setCookieGA( code, true );

    }

}

function setCookieGA( code = "", status = false ) {

    if ( code != '' ) {

        gtag( 'set', 'allow_google_signals', status );
        gtag( 'set', 'allow_ad_personalization_signals', status );
        window['ga-disable-' + code] = !status;

    }

}
