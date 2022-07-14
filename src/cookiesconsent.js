/**
 * CookiesConsentJS 1.1
 * oxterisk@protonmail.com
 * oxterisk@proton.me
 */

class CookiesConsent {

    constructor( params = '' ) {

        this.params = params == '' ? {} : params;
        this.params.cookies_status = [];
        this.availablePositions = ['top','top-left','top-right','top-center','bottom','bottom-left','bottom-right','bottom-center'];
        this.checkParameters();

        if ( this.isPageAllowedToShowConsent() ) {

            if ( !this.answeredConsent() ) {

                this.printHtmlMessage();
                this.callbackFunction( "first-load" );

            } else {

                this.checkCookies();
                this.printDismissButton();
                this.callbackFunction( "load" );

            }

        }

    }

    isPageAllowedToShowConsent() {

        let allowed = true;

        if ( this.params.hasOwnProperty( "denylistPages" ) ) {

            const url = window.location.pathname;

            this.params.denylistPages.forEach(
                function( page ) {
                    if ( page != '' && url.indexOf( page ) !== -1 ) allowed = false;
                }
            );

        }

        return allowed;

    }

    answeredConsent() {

        const cookie_name = "consentcookies_status=";
        const ca = document.cookie.split( ";" );
        let status = "";

        for ( let i = 0; i < ca.length; i++ ) {

            let c = ca[i];
            while ( c.charAt(0) == ' ' )
                c = c.substring( 1 );

            if ( c.indexOf(cookie_name ) == 0)
                status = c.substring( cookie_name.length, c.length );

        }

        this.params.answered = status != "" ? true : false;
        return this.params.answered;

    }

    checkCookies() {

        const cookies = document.cookie.split( " " );

        for ( let i = 0; i < cookies.length; i++ ) {

            let cookie = cookies[i].split( "=" );

            if ( this.params.cookies_status.hasOwnProperty( cookie[0] ) )
                this.params.cookies_status[cookie[0]] = true;

        }

    }

    checkParameters() {

        if ( this.params.hasOwnProperty( "cookies" ) ) {

            for ( const cookie in this.params.cookies )
                if ( this.params.cookies[cookie].hasOwnProperty( "name" ) )
                    this.params.cookies_status[this.params.cookies[cookie]["name"]] =  false;

        } else {

            this.params.cookies = {};

        }

        this.params.mainWindowSettings = this.params.hasOwnProperty( "mainWindowSettings" ) && this.params.mainWindowSettings ? true : false;
        this.params.position = this.params.hasOwnProperty( "position" ) && this.params.position != "" && this.availablePositions.includes( this.params.position ) ? this.params.position : "bottom-left";
        this.params.btnDismissPosition = this.params.hasOwnProperty( "btnDismissPosition" ) && this.params.btnDismissPosition != "" ? this.params.btnDismissPosition : "bottom-left";
        this.params.expirationDays = this.params.hasOwnProperty( "expirationDays" ) && this.params.expirationDays != "" ? this.params.expirationDays : 0;
        this.params.animation = this.params.hasOwnProperty( "animation" ) && !this.params.animation ? false : true;

        this.params.path = this.params.hasOwnProperty( "path" ) && this.params.path != "" ? `path=${this.params.path}` : "path=/";

        const content_default = {

            title : "Cookies compliance",
            message : "We use cookies",
            policy : "",
            btnAccept : "Accept all",
            btnReject : "Reject all",
            btnDismiss : "Cookies policy",
            btnInfo : "Details",
            btnSettings : "Settings",
            content_align : "left",
            info : "",

        };

        if ( this.params.hasOwnProperty( "content" ) ) {

            this.params.content.title = this.params.content.hasOwnProperty( "title" ) ? this.params.content.title : content_default.title;
            this.params.content.message = this.params.content.hasOwnProperty( "message" ) ? this.params.content.message : content_default.message;
            this.params.content.info = this.params.content.hasOwnProperty( "info" ) ? this.params.content.info : content_default.info;
            this.params.content.policy = this.params.content.hasOwnProperty( "policy" ) ? this.params.content.policy : content_default.policy;
            this.params.content.btnDismiss = this.params.content.hasOwnProperty( "btnDismiss" ) ? this.params.content.btnDismiss : content_default.btnDismiss;
            this.params.content.policyLink = this.params.content.hasOwnProperty( "policyLink" ) ? this.params.content.policyLink : "";
            this.params.content.btnAccept = this.params.content.hasOwnProperty( "btnAccept" ) ? this.params.content.btnAccept : content_default.btnAccept;
            this.params.content.btnReject = this.params.content.hasOwnProperty( "btnReject" ) ? this.params.content.btnReject : content_default.btnReject;
            this.params.content.btnInfo = this.params.content.hasOwnProperty( "btnInfo" ) ? this.params.content.btnInfo : content_default.content_btnInfo;
            this.params.content.btnSettings = this.params.content.hasOwnProperty( "btnSettings" ) ? this.params.content.btnSettings : content_default.btnSettings;
            if ( this.params.content.align != "right" && this.params.content.align != "left" && this.params.content.align != "center" )
                this.params.content.align = content_default.content_align;

        } else {

            this.params.content = content_default;

        }

    }

    printHtmlMessage() {

        if ( this.params.mainWindowSettings ) {

            this.showhideSettings();

        } else {

            const cc_window = document.getElementById( "cc-window" );

            if ( !cc_window ) {

                // Position
                let positionCss = `cc-pos-${this.params.position}`;
                let contentAlign = `cc-content-${this.params.content.align}`;
                let positionInsert = "afterbegin";

                if ( this.params.position == "bottom" || this.params.position == "bottom-right" || this.params.position == "bottom-left" || this.params.position == "bottom-center" )
                    positionInsert = "beforeend";

                // Buttons
                let buttons = this.getHtmlButtons();

                // Policy link
                let policy = "";

                if ( this.params.content.policy != "" && this.params.content.policyLink != "" )
                    policy = `<a href="${this.params.content.policyLink}" target="_blank">${this.params.content.policy}</a>`;

                let content = `
                <div class="cc-window-content">
                    <div class="cc-window-title">${this.params.content.title}</div>
                    <div class="cc-window-message">${this.params.content.message} <span class="cc-window-policy">${policy}</span></div>
                    <div class="cc-window-buttons">${buttons}</div>
                </div>`;

                // Create window
                let htmlMessage = document.createElement( "div" );
                htmlMessage.id = "cc-window";
                htmlMessage.classList.add( "cc-window" );
                htmlMessage.classList.add( positionCss );
                htmlMessage.classList.add( contentAlign );

                if ( this.params.animation ) { htmlMessage.classList.add( "cc-animation-in" ); }

                htmlMessage.innerHTML = content;

                document.body.insertAdjacentElement( positionInsert, htmlMessage );

                this.attachEventsButtons();

            }

        }

    }

    getHtmlButtons() {

        if ( this.params.hasOwnProperty( "buttons" ) ) {

            if ( Array.isArray( this.params.buttons ) ) {

                let html = "";
                const scope = this;

                this.params.buttons.forEach(

                    function( button ) {

                        if ( button == "accept" )
                            html += `<button type="button" id="cc-btn-accept" class="cc-btn-accept">${scope.params.content.btnAccept}</button>`;
                        else if ( button == "reject" )
                            html += `<button type="button" id="cc-btn-reject" class="cc-btn-reject">${scope.params.content.btnReject}</button>`;
                        else if ( button == "info" )
                            html += `<button type="button" id="cc-btn-info" class="cc-btn-info">${scope.params.content.btnInfo}</button>`;
                        else if ( button == "settings" )
                            html += `<button type="button" id="cc-btn-settings" class="cc-btn-info">${scope.params.content.btnSettings}</button>`;

                    }

                );

                return html;

            }

        }

        return `<button type="button" id="cc-btn-accept" class="cc-btn-accept">${this.params.content.btnAccept}</button>`;

    }

    removeHtmlMessage() {

        if ( !this.params.mainWindowSettings ) {

            const elem = document.getElementById( "cc-window" );

            if ( this.params.animation ) {

                elem.id = "cc-window-out";
                elem.classList.remove( "cc-animation-in" );
                elem.classList.add( "cc-animation-out" );

                const btnAccept = document.getElementById( "cc-btn-accept" );
                if ( btnAccept ) { btnAccept.id = "cc-btn-accept-out"; }
                const btnReject = document.getElementById( "cc-btn-reject" );
                if ( btnReject ) { btnReject.id = "cc-btn-reject-out"; }
                const btnInfo = document.getElementById( "cc-btn-info" );
                if ( btnInfo ) { btnInfo.id = "cc-btn-info-out"; }
                const btnSettings = document.getElementById( "cc-btn-settings" );
                if ( btnSettings ) { btnSettings.id = "cc-btn-settings-out"; }

                setTimeout( function() { if ( elem ) { elem.remove(); } }, 2000 );

            } else {

                if ( elem ) { elem.remove(); }

            }

        }

    }

    printDismissButton() {

        const cc_btn_dismiss = document.getElementById( "cc-btn-dismiss" );

        if ( !cc_btn_dismiss ) {

            if ( this.params.hasOwnProperty( "buttons" ) && this.params.buttons.indexOf( "dismiss" ) >= 0 ) {

                let positionCss = `cc-pos-${this.params.btnDismissPosition}`;
                let positionInsert = "beforeend";

                if ( this.params.position == "top-right" || this.params.position == "top-left" )
                    positionInsert = "afterbegin";

                let dismissButton = document.createElement( "div" );
                dismissButton.id = "cc-btn-dismiss";
                dismissButton.classList.add( positionCss );
                dismissButton.innerHTML = this.params.content.btnDismiss;

                document.body.insertAdjacentElement( positionInsert, dismissButton );

                this.attachEventsButtons();

            }

        }

    }

    removeDismissButton() {

        const elem = document.getElementById( "cc-btn-dismiss" );

        if ( elem )
            elem.remove();

    }

    showhideInfo() {

        if ( this.params.content.info != "" ) {

            const divInfo = document.createElement( "div" );
            divInfo.innerHTML = this.params.content.info;

            this.openPopUp( "cc-window-info", divInfo );

        }

    }

    showhideSettings() {

        const divCookieSettings = document.createElement( "div" );
        divCookieSettings.className = "cc-window-settings-cookies";

        this.params["hideDescription"] = this.params.hasOwnProperty( "hideDescription" ) && !this.params["hideDescription"] ? false : true;

        if ( this.params.content.hasOwnProperty( "settingsHeader" ) && this.params.content.settingsHeader != '' ) {

            const divHeader = document.createElement( "div" );
            divHeader.className = "cc-window-settings-header";
            divHeader.innerHTML = this.params.content.settingsHeader;
            divCookieSettings.appendChild( divHeader );

        }

        for ( const cookie in this.params.cookies ) {

            const elem_id = Math.floor(Math.random() * 10000);

            const divCookie = document.createElement( "div" );
            divCookie.setAttribute( "id", cookie );
            divCookie.className = "cc-window-settings-cookie";

            const divCookieContent = document.createElement( "div" );
            divCookieContent.className = "cc-window-settings-cookie-content";

            if ( this.params.cookies[cookie].hasOwnProperty( "title" ) ) {

                const divTitle = document.createElement( "div" );
                divTitle.className = "cc-window-settings-cookie-title";
                divTitle.innerHTML = `${this.params.cookies[cookie]["title"]}`;

                if ( this.params.cookies[cookie].hasOwnProperty( "description" ) && this.params.cookies[cookie]["description"] != '' && this.params["hideDescription"] ) {

                    const scope = this;

                    divTitle.innerHTML += ` <div id="cc-window-icon-dropdown-id-${elem_id}">&#10095;</div>`;
                    divTitle.classList.add( "cc-window-settings-cookie-title-dropdown" );

                    divTitle.addEventListener( "click", function() {
                        scope.showhideDescription( elem_id );
                    } );

                }

                divCookieContent.appendChild( divTitle );

            }

            if ( this.params.cookies[cookie].hasOwnProperty( "description" ) && this.params.cookies[cookie]["description"] != '' ) {

                const divDescription = document.createElement( "div" );
                divDescription.id = `cc-window-desc-id-${elem_id}`;
                divDescription.className = "cc-window-settings-cookie-desc";

                if ( this.params.cookies[cookie].hasOwnProperty( "title" ) && this.params.cookies[cookie]["title"] != '' && this.params["hideDescription"] ) {

                    divDescription.style.display = "none";

                }

                divDescription.innerHTML = this.params.cookies[cookie]["description"];
                divCookieContent.appendChild( divDescription );

            }

            divCookie.appendChild( divCookieContent );

            let checked = "";

            if ( this.params.answered ) {

                if ( this.params.cookies[cookie].hasOwnProperty( "name" ) ) {

                    checked = this.params.cookies_status.hasOwnProperty( this.params.cookies[cookie]["name"] ) && this.params.cookies_status[this.params.cookies[cookie]["name"]] ? ' checked="checked"' : "";

                }

            } else {

                checked = this.params.cookies[cookie].hasOwnProperty( "checked" ) && this.params.cookies[cookie].checked ? ' checked="checked"' : "";

            }

            const disabled = this.params.cookies[cookie].hasOwnProperty( "disabled" ) && this.params.cookies[cookie].disabled && checked != "" ? ' disabled="disabled"' : "";

            const divStatus = document.createElement( "div" );
            divStatus.className = "cc-window-settings-cookie-value";
            divStatus.innerHTML = `<label class="switch"><input type="checkbox" class="cc-cookie-checkbox" id="cc-cookie-${this.params.cookies[cookie]["name"]}" data-name="${this.params.cookies[cookie]["name"]}" name="cc-cookie-${this.params.cookies[cookie]["name"]}"${checked}${disabled}><span class="slider round"></span></label>`;

            divCookie.appendChild( divStatus );
            divCookieSettings.appendChild( divCookie );

        }

        if ( divCookieSettings.innerHTML != '' ) {

            const btnSettingsSelectAll = "Select all";
            const btnSettingsUnselectAll = "Unselect all";
            const btnSettingsAccept = "Accept selection";

            this.params.content.btnSettingsSelectAll = this.params.content.hasOwnProperty( "btnSettingsSelectAll" ) ? this.params.content.btnSettingsSelectAll : btnSettingsSelectAll;
            this.params.content.btnSettingsUnselectAll = this.params.content.hasOwnProperty( "btnSettingsUnselectAll" ) ? this.params.content.btnSettingsUnselectAll : btnSettingsUnselectAll;
            this.params.content.btnSettingsAccept = this.params.content.hasOwnProperty( "btnSettingsAccept" ) ? this.params.content.btnSettingsAccept : btnSettingsAccept;

            const divButtons = document.createElement( "div" );
            divButtons.className = "cc-window-settings-buttons";
            divButtons.innerHTML = `<button type="button" id="cc-btn-settings-select" class="cc-btn-settings-select" data-action="select">${this.params.content.btnSettingsSelectAll}</button>
            <button type="button" id="cc-btn-settings-accept" class="cc-btn-settings-accept">${this.params.content.btnSettingsAccept}</button>`;

            divCookieSettings.appendChild( divButtons );

        }

        if ( this.params.content.hasOwnProperty( "settingsFooter" ) && this.params.content.settingsFooter != '' ) {

            const divFooter = document.createElement( "div" );
            divFooter.className = "cc-window-settings-footer";
            divFooter.innerHTML = this.params.content.settingsFooter;
            divCookieSettings.appendChild( divFooter );

        }

        this.openPopUp( "cc-window-settings", divCookieSettings );
        this.attachEventsSettingsButtons();

    }

    showhideDescription( id ) {

        const description = document.getElementById( `cc-window-desc-id-${id}` );
        const icon = document.getElementById( `cc-window-icon-dropdown-id-${id}` );

        if ( description.style.display == "block" ) {
            icon.style.transform = "rotate(0deg)";
            description.style.display = "none";
        } else {
            icon.style.transform = "rotate(90deg)";
            description.style.display = "block";
        }

    }

    openPopUp( id, content ) {

        let htmlPopUp = document.createElement( "div" );
        htmlPopUp.id = id;
        htmlPopUp.classList.add( "cc-modal" );

        let modalWindow = document.createElement( "div" );
        modalWindow.classList.add( "cc-modal-window" );

        let modalContent = document.createElement( "div" );
        modalContent.classList.add( "cc-modal-content" );
        modalContent.appendChild( content );

        if ( !this.params.mainWindowSettings ) {

            let modalClose = document.createElement( "div" );
            modalClose.id = "cc-modal-close"
            modalClose.classList.add( "cc-modal-close" );
            modalClose.innerHTML = "&times;";

            modalWindow.appendChild( modalClose );

        }


        modalWindow.appendChild( modalContent );
        htmlPopUp.appendChild( modalWindow );

        document.body.insertAdjacentElement( "beforeend", htmlPopUp );

        htmlPopUp.style.display = "block";

        const btnClose = document.getElementById( "cc-modal-close" );

        if ( btnClose )
            document.getElementById( "cc-modal-close" ).addEventListener( "click", function() { htmlPopUp.remove(); } );

    }

    closePopUp() {

        const modals = document.getElementsByClassName( "cc-modal" );

        for( var i = 0; i < modals.length; i++ )
            modals[i].remove();

    }

    attachEventsButtons() {

        const btnAccept = document.getElementById( "cc-btn-accept" );
        const btnReject = document.getElementById( "cc-btn-reject" );
        const btnInfo = document.getElementById( "cc-btn-info" );
        const btnSettings = document.getElementById( "cc-btn-settings" );
        const btnDismiss = document.getElementById( "cc-btn-dismiss" );
        const scope = this;

        if ( btnAccept )
            btnAccept.addEventListener( "click", function() {
                scope.removeHtmlMessage();
                scope.printDismissButton();
                scope.setCookieStatusInParams( "accept_all" );
                scope.setCookieConsent( "accept" );
                scope.callbackFunction( "accept" );
            } );

        if ( btnReject )
            btnReject.addEventListener( "click", function() {
                scope.removeHtmlMessage();
                scope.printDismissButton();
                scope.setCookieStatusInParams( "reject_all" );
                scope.setCookieConsent( "reject" );
                scope.callbackFunction( "reject" );
            } );

        if ( btnInfo )
            btnInfo.addEventListener( "click", function() {
                scope.showhideInfo();
            } );

        if ( btnDismiss )
            btnDismiss.addEventListener( "click", function() {
                scope.printHtmlMessage();
                scope.removeDismissButton();
            } );

        if ( btnSettings )
            btnSettings.addEventListener( "click", function() {
                scope.showhideSettings();
            } );

    }

    attachEventsSettingsButtons() {

        const btnSelect = document.getElementById( "cc-btn-settings-select" );
        const btnAccept = document.getElementById( "cc-btn-settings-accept" );

        const scope = this;

        if ( btnSelect )
            btnSelect.addEventListener( "click", function() {
                scope.changeStateSettingsSelection();
            } );

        if ( btnAccept )
            btnAccept.addEventListener( "click", function() {
                scope.removeHtmlMessage();
                scope.printDismissButton();
                scope.setCookieStatusInParams( "selection" );
                scope.setCookieConsent( "selection" );
                scope.closePopUp();
                scope.callbackFunction( "accept" );
            } );

    }

    changeStateSettingsSelection() {

        const elem = document.getElementById( "cc-btn-settings-select" );
        const action = elem.dataset.action;
        let status = false;

        if ( action == "select" ) {

            status = true;
            elem.innerHTML = this.params.content.btnSettingsUnselectAll;
            elem.dataset.action = "unselect";

        } else if ( action == "unselect" ) {

            elem.innerHTML = this.params.content.btnSettingsSelectAll;
            elem.dataset.action = "select";

        }

        const chk_cookie = document.querySelectorAll( ".cc-window-settings-cookie-value .cc-cookie-checkbox" );

        for ( let i = 0; i < chk_cookie.length; i++ )
            if ( !chk_cookie[i].disabled )
                chk_cookie[i].checked = status;

    }

    setCookieConsent( status = "" ) {

        let expires = "";

        if ( this.params.expirationDays > 0 ) {

            let d = new Date();
            d.setTime( d.getTime() + ( this.params.expirationDays*24*60*60*1000 ) );
            expires = "expires=" + d.toUTCString();

        }

        const value = btoa( status + ":" + Date.now() );

        let sameSite = "SameSite=Lax";

        if ( this.params.hasOwnProperty( "sameSite" ) ) {

            if ( this.params.sameSite == "none" )
                sameSite = "SameSite=None;Secure";

            if ( this.params.sameSite == "strict" )
                sameSite = "SameSite=Strict";

        }

        document.cookie = `consentcookies_status=${value};${expires};${this.params.path};${sameSite};`;

        Object.entries( this.params.cookies_status ).forEach( ( [key, value] ) => {
            if ( value )
                document.cookie = `${key}=${btoa( key + ":" + Date.now() )};${expires};${this.params.path};${sameSite};`;
            else
                document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;${this.params.path}`;
        });

        this.params.answered = true;

    }

    setCookieStatusInParams( $type ) {

        if ( this.params.hasOwnProperty( "cookies_status" ) ) {

            if ( $type == "accept_all" ) {

                for ( const cookie in this.params.cookies_status )
                    this.params.cookies_status[cookie] = true;

            } else if ( $type == "reject_all" ) {

                for ( const cookie in this.params.cookies_status )
                    this.params.cookies_status[cookie] = false;

            } else if ( $type == "selection" ) {

                const chk_cookie = document.querySelectorAll( ".cc-window-settings-cookie-value .cc-cookie-checkbox" );

                for ( let i = 0; i < chk_cookie.length; i++ )
                    if ( this.params.cookies_status.hasOwnProperty( chk_cookie[i].dataset.name ) )
                        this.params.cookies_status[chk_cookie[i].dataset.name] = chk_cookie[i].checked;

            }

        }

    }

    callbackFunction( type = "" ) {

        // BEGIN: Google Analytics callbacks

        if ( this.params.cookies.hasOwnProperty( "cc_ga" ) ) {

                const status = this.params.hasOwnProperty( "cookies_status" ) && this.params.cookies_status.hasOwnProperty( "cc_ga" ) && this.params.cookies_status.cc_ga === true ? true : false;

                try {
                    manageGoogleAnalytics({ lifecycle: type, cookie: this.params.cookies.cc_ga, status, path: this.params.path });
                } catch( err ) {
                    console.log( `ERROR: cc-ga.js script not loaded` );
                }

        }

        // END: Google Analytics callbacks

        // BEGIN: Google Tag Manager callbacks

        if ( this.params.cookies.hasOwnProperty( "cc_gtm" ) ) {

                const status = this.params.hasOwnProperty( "cookies_status" ) && this.params.cookies_status.hasOwnProperty( "cc_gtm" ) && this.params.cookies_status.cc_gtm === true ? true : false;

                try {
                    manageGoogleTagManager({ lifecycle: type, cookie: this.params.cookies.cc_gtm, status });
                } catch( err ) {
                    console.log( `ERROR: cc-gtm.js script not loaded` );
                }

        }

        // END: Google Tag Manager callbacks

        if ( type == "first-load" && this.params.hasOwnProperty( "callback" ) && this.params.callback.hasOwnProperty( "first_load" ) && this.params.callback.first_load != "" ) {
            try {
                eval( `${this.params.callback.first_load}(this.params.cookies_status)` );
            } catch( err ) {
                console.log( `ERROR: Function ${this.params.callback.first_load} not found` );
            }
        } else if ( type == "load" && this.params.hasOwnProperty( "callback" ) && this.params.callback.hasOwnProperty( "load" ) && this.params.callback.load != "" ) {
            try {
                eval( `${this.params.callback.load}(this.params.cookies_status)` );
            } catch( err ) {
                console.log( `ERROR: Function ${this.params.callback.first_load} not found` );
            }
        } else if ( type == "accept" && this.params.hasOwnProperty( "callback" ) && this.params.callback.hasOwnProperty( "accept" ) && this.params.callback.accept != "" ) {
            try {
                eval( `${this.params.callback.accept}(this.params.cookies_status)` );
            } catch( err ) {
                console.log( `ERROR: Function ${this.params.callback.first_load} not found` );
            }
        } else if ( type == "reject" && this.params.hasOwnProperty( "callback" ) && this.params.callback.hasOwnProperty( "reject" ) && this.params.callback.reject != "" ) {
            try {
                eval( `${this.params.callback.reject}(this.params.cookies_status)` );
            } catch( err ) {
                console.log( `ERROR: Function ${this.params.callback.first_load} not found` );
            }
        }

    }

    getStatus() { return this.params.answered; }
    getConfig() { return this.params; }
    showMessage() {
        try {
            this.printHtmlMessage();
            this.removeDismissButton();
        } catch( err ) {
            console.log( `ERROR: Can not show message` );
        }

    }

    removeCookies() {

        let cookies = document.cookie;
        let ca = cookies.split( ";" );

        for( let i = 0; i < ca.length; i++ ) {

            let key = ca[i].split( "=" );
            document.cookie = `${key[0]}="";expires=Thu, 01 Jan 1970 00:00:00 UTC;${this.params.path}`;

        }

    }

}

function CookiesConsentJS( params = '' ) {

    return new CookiesConsent( params );

}
