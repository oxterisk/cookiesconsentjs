/**
 * CookiesConsentJS 0.9
 * oxterisk@protonmail.com
 */

class CookiesConsent {

    constructor( params = '' ) {

        this.params = params == '' ? {} : params;
        this.params.cookies_status = [];
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

        this.params.position = this.params.hasOwnProperty( "position" ) && this.params.position != "" ? this.params.position : "top";
        this.params.btnDismissPosition = this.params.hasOwnProperty( "btnDismissPosition" ) && this.params.btnDismissPosition != "" ? this.params.btnDismissPosition : "bottom-left";
        this.params.expirationDays = this.params.hasOwnProperty( "expirationDays" ) && this.params.expirationDays != "" ? this.params.expirationDays : 0;

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

        const cc_window = document.getElementById("cc-window");

        if ( !cc_window ) {

            // Position
            let positionCss = `cc-pos-${this.params.position}`;
            let contentAlign = `cc-content-${this.params.content.align}`;
            let positionInsert = "afterbegin";

            if ( this.params.position == "bottom" || this.params.position == "bottom-right" || this.params.position == "bottom-left" )
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
            htmlMessage.classList.add( positionCss );
            htmlMessage.classList.add( contentAlign );
            htmlMessage.innerHTML = content;

            document.body.insertAdjacentElement( positionInsert, htmlMessage );

            this.attachEventsButtons();

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

        const elem = document.getElementById( "cc-window" );

        if ( elem )
            elem.remove();

    }

    printDismissButton() {

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

    removeDismissButton() {

        const elem = document.getElementById( "cc-btn-dismiss" );

        if ( elem )
            elem.remove();

    }

    showhideInfo() {

        if ( this.params.content.info != "" )
            this.openPopUp( "cc-window-info", this.params.content.info );

    }

    showhideSettings() {

        let settings = "";

        for ( const cookie in this.params.cookies ) {

            settings += `<div id="${cookie}" class="cc-window-settings-cookie"><div class="cc-window-settings-cookie-desc">`;

            if ( this.params.cookies[cookie].hasOwnProperty( "description" ) )
                settings += this.params.cookies[cookie]["description"];

            let checked = "";

            if ( this.params.answered ) {

                if ( this.params.cookies[cookie].hasOwnProperty( "name" ) ) {

                    checked = this.params.cookies_status.hasOwnProperty( this.params.cookies[cookie]["name"] ) && this.params.cookies_status[this.params.cookies[cookie]["name"]] ? ' checked="checked"' : "";

                }

            } else {

                checked = this.params.cookies[cookie].hasOwnProperty( "checked" ) && this.params.cookies[cookie].checked ? ' checked="checked"' : "";

            }

            let disabled = this.params.cookies[cookie].hasOwnProperty( "disabled" ) && this.params.cookies[cookie].disabled && checked != "" ? ' disabled="disabled"' : "";



            settings += `</div><div class="cc-window-settings-cookie-value"><input type="checkbox" class="cc-cookie-checkbox" id="cc-cookie-${this.params.cookies[cookie]["name"]}" data-name="${this.params.cookies[cookie]["name"]}" name="cc-cookie-${this.params.cookies[cookie]["name"]}"${checked}${disabled}>`;

            settings += "</div></div>";

        }

        if ( settings != "" ) {

            const btnSettingsSelectAll = "Select all";
            const btnSettingsUnselectAll = "Unselect all";
            const btnSettingsAccept = "Accept selection";

            this.params.content.btnSettingsSelectAll = this.params.content.hasOwnProperty( "btnSettingsSelectAll" ) ? this.params.content.btnSettingsSelectAll : btnSettingsSelectAll;
            this.params.content.btnSettingsUnselectAll = this.params.content.hasOwnProperty( "btnSettingsUnselectAll" ) ? this.params.content.btnSettingsUnselectAll : btnSettingsUnselectAll;
            this.params.content.btnSettingsAccept = this.params.content.hasOwnProperty( "btnSettingsAccept" ) ? this.params.content.btnSettingsAccept : btnSettingsAccept;

            settings += `<div class="cc-window-settings-buttons">
                <button type="button" id="cc-btn-settings-select" class="cc-btn-settings-select" data-action="select">${this.params.content.btnSettingsSelectAll}</button>
                <button type="button" id="cc-btn-settings-accept" class="cc-btn-settings-accept">${this.params.content.btnSettingsAccept}</button>
            </div>`;

            this.openPopUp( "cc-window-settings", settings );

            this.attachEventsSettingsButtons();

        }

    }

    openPopUp( id, content ) {

        const popup = `
        <div class="cc-modal-window">
            <div id="cc-modal-close" class="cc-modal-close">&times;</div>
            <div class="cc-modal-content">${content}</div>
        </div>`;

        let htmlPopUp = document.createElement( "div" );
        htmlPopUp.id = id;
        htmlPopUp.classList.add( "cc-modal" );
        htmlPopUp.innerHTML = popup;
        document.body.insertAdjacentElement( "beforeend", htmlPopUp );

        htmlPopUp.style.display = "block";
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
                scope.removeDismissButton();
                scope.printHtmlMessage();
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

        if ( type == "first-load" && this.params.hasOwnProperty( "callback" ) && this.params.callback.hasOwnProperty( "first_load" ) && this.params.callback.first_load != "" )
            eval( `${this.params.callback.first_load}(this.params.cookies_status)` );
        else if ( type == "load" && this.params.hasOwnProperty( "callback" ) && this.params.callback.hasOwnProperty( "load" ) && this.params.callback.load != "" )
            eval( `${this.params.callback.load}(this.params.cookies_status)` );
        else if ( type == "accept" && this.params.hasOwnProperty( "callback" ) && this.params.callback.hasOwnProperty( "accept" ) && this.params.callback.accept != "" )
            eval( `${this.params.callback.accept}(this.params.cookies_status)` );
        else if ( type == "reject" && this.params.hasOwnProperty( "callback" ) && this.params.callback.hasOwnProperty( "reject" ) && this.params.callback.reject != "" )
            eval( `${this.params.callback.reject}(this.params.cookies_status)` );

    }

    getStatus() { return this.params.answered; }
    getConfig() { return this.params; }
    showMessage() { this.removeDismissButton(); this.printHtmlMessage(); }

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
