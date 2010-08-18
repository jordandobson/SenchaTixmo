/* 

  THINGS TO DO

    * Display Homescreen Message for iPad & iPhone
    * Setup 
    * Add in a Timeout for login attempt
    
  NEXT STEPS
  
    * Update the CSS for the Tab Bar for Retina Display

*/

// window.console.log(  );

Ext.setup({

    tabletStartupScreen:  'tablet_startup.png',
    phoneStartupScreen:   'phone_startup.png',
    icon:                 'icon.png',
    glossOnIcon:          false,
    onReady:              function() {

        var loadingMarkup     = '<div class="loading wrapper"><div class="spins"><span class="t"></span><span class="r"></span><span class="b"></span><span class="l"></span></div></div>';
        var standaloneMarkup  = '<div class="message wrapper"><p><strong>Install Tixato</strong><span>Add Tixato to your home screen by pressing this browsers <strong>+</strong> icon.</span></p></div>';
        
        var loginSuccessMsg   = 'Logged in as ';
        var loginFailureMsg   = 'Sorry, the info you provided is incorrect.';
        var loginErrorMsg     = 'Sorry, an unknown error occured. Try Again.';
        var loginBlankMsg     = 'Please fill in both username and password.';
        var logoutMsg         = 'You are logged out.';
        
        var toggleAlertXCmp = function( setTo, style, msg ){
            cmp = Ext.getCmp('loginAlertTxt');
            if( setTo != 'update' ){ ( setTo == 'show' ) ? cmp.show() : cmp.hide(); }
            ( style ) ? cmp.update('<p class="'+style+'"><strong>'+msg+'</strong></p>') : cmp.update('');
        };
        
        var setLocalStorage = function( sid, contents ){
          // window.console.log("<<<<: " + sid + " : " + contents);
          localStorage.setItem( sid, contents );
        };
        
        var getLocalStorage = function( sid ){
          var localItem = localStorage.getItem( sid );
          // window.console.log(">>>>: " + sid + " : " + localItem);
          if( localItem ){
            return Ext.decode( localItem );
          }else{
            return false;
          }
        };
        
        var setAsLoggedIn = function( init ){
        
        // Get the Value from Local Storage
            var creds = getLocalStorage('credentials');                                     // What if they don't support local Storage? Should we have a session variable?
  
          // Hide Login Elements & Show Logout Button
            Ext.getCmp( 'loginFormFields' ).hide();
            Ext.getCmp( 'loginFormButton' ).hide();
            
            if( !init ){
              // Update The Success Message and Show it
                toggleAlertXCmp('show', 'success', loginSuccessMsg + creds.login );
              // Show logout button
                Ext.getCmp( 'logoutFormButton' ).show();
            }else{
              // Update The Success Message Only
                toggleAlertXCmp('update', 'success', loginSuccessMsg + creds.login);
            }
        };

        var attemptLogin = function(){
        
          // Blur Inputs So keyboard Hides
            var loginInputs = document.getElementsByTagName("input");
            loginInputs[0].blur();
            loginInputs[1].blur();
            
            //form.getComponent('email').fieldEl.dom.blur();
            
          // Store Alert Display Object
            var loginAlertXCmp = Ext.getCmp('loginAlertTxt');
          
          // Clear the alert text
            toggleAlertXCmp('hide');
            
          // Get the Values of the login fields
            fields = loginPanel.getValues();
            
          // Cancel form if either fields are empty and display message
            if (fields.login == "" || fields.password == ""){
              toggleAlertXCmp('show', 'required', loginBlankMsg );
              return false;
            }
            
          // Show Loading Display
            Ext.getBody().mask(false, loadingMarkup);
            
          // Make AJAX Request
            Ext.Ajax.request({
                url:      '/login.json',
                params:   loginPanel.getValues(),   // Move fields variable here
                success:  function(response, opts) {
                
                // Store & Decode JSON Response
                  setLocalStorage( 'credentials', response.responseText );
                  
              // Setup the interface as the user is logged in
                  setAsLoggedIn();
                  
                // Hide Loading Display
                  Ext.getBody().unmask();
  
                // Display the tab bar & Shows Panel
                  panel.setCard(0, null);
                  tabBar.show('fade');
                },
                failure:  function(response, opts){
                ///////////////////////////////////
                  
                // Show Failure Message
                  toggleAlertXCmp('show', 'failure', loginFailureMsg );
                  
                // Hide Loading Display
                  Ext.getBody().unmask();
                }
            })
        };
        
        var logoutUser = function(){
          localStorage.removeItem('credentials');
          tabBar.hide('fade');
          toggleAlertXCmp('show', 'notify', logoutMsg );
          Ext.getCmp('loginFormUsername').setValue('');
          Ext.getCmp('loginFormPassword').setValue('');
          Ext.getCmp('loginFormFields'  ).show('fade');
          Ext.getCmp('loginFormButton'  ).show('fade');
          Ext.getCmp('logoutFormButton' ).hide();
        }

        var showsPanel = new Ext.Component({
            title:    'Shows',
            cls:      'shows',
            scroll:   'vertical',
            iconCls:  'favorites',
            html:     '<div class="alert nonform"><p class="notify"><strong>Shows is not yet implemented.</strong></p></div>'
        });
        
        var receiptsPanel = new Ext.Component({
            title:    'Receipts',
            cls:      'receipts',
            scroll:   'vertical',
            iconCls:  'info',
            html:     '<div class="alert nonform"><p class="notify"><strong>Receipts is not yet implemented.</strong></p></div>'
        });

        var loginAlert = new Ext.Component({
          id:         'loginAlertTxt',
          html:       '',
          baseCls:    'x-plain',
          cls:        'alert'
        });

        var loginButton = {
          xtype:      'button',
          id:         'loginFormButton',
          text:       'Log In',
          baseCls:    'x-plain',
          cls:        'submit',
          handler:    attemptLogin
        }
        
        var logoutButton = {
          xtype:      'button',
          id:         'logoutFormButton',
          text:       'Log Out',
          baseCls:    'x-plain',
          cls:        'submit',
          handler:    logoutUser
        }

        var checkForEnter = function(val, inputField){
          if(val == 13){ attemptLogin(); }
        }
        
        var loginPanel = new Ext.form.FormPanel({
          id:         'loginAppForm',
          title:      'Settings',
          scroll:     'vertical',
          cls:        'login',
          iconCls:    'settings',
          baseCls:    'x-plain',
          items:      [  
            loginAlert,{
              xtype:        'fieldset',
              id:           'loginFormFields',
              baseCls:      'x-plain',
              cls:          'group',
              items: [{
                id:             'loginFormUsername',
                xtype:          'emailfield',
                name:           'login',
                placeholder:    'Username',
/*                 value:          'jordandobson',  */                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                baseCls:        'x-plain',
                cls:            'custom',
                listeners:{     keyup: function(thisField, e) { checkForEnter(e.browserEvent.keyCode, this); } }
              },{
                xtype:          'passwordfield',
                id:             'loginFormPassword',
                name:           'password',
                placeholder:    'Password',
/*                 value:          'awesome', */
                baseCls:        'x-plain',
                cls:            'custom',
                listeners:{     keyup: function(thisField, e) { checkForEnter(e.browserEvent.keyCode, this); } }
              }]
            },
            loginButton, logoutButton ]
        });

        var panel = new Ext.TabPanel({
          tabBar:       { dock: 'bottom', layout: { pack: 'center' } },
          activeItem:   false,
          fullscreen:   true,
          items:        [showsPanel, receiptsPanel, loginPanel]
        });

      
      // Hide Tab Bar on Initialize
        var tabBar = panel.getTabBar();
        tabBar.hide();
        
      // check to see if it's iOS and not standalone
        if ( !window.navigator.standalone && Ext.platform.isIPhoneOS ) {
          var myPanel = new Ext.Panel({
            fullscreen:   true,
            html:         standaloneMarkup,
            baseCls:      'x-plain',
            cls:          'opacity0 standalone',
            animation:    'fade',
            hidden:       true
          });
          myPanel.show('pop');
          myPanel.addClass('opacity100');
        } else {

        // See if login is stored - !!! Research how to do this with SenchaTouch instead
        
          if( localStorage && getLocalStorage('credentials')){
            // Setup Login Screen
              setAsLoggedIn('init');
              
            // Show Bottom Tab Bar
              tabBar.show();
              
            // Fade to First Card
              panel.setCard( 0, 'fade' );
            
          }else{          
            // Show Login Panel
              panel.setCard( 2, 'fade');
              
              // Hide Logout Button        
              Ext.getCmp('logoutFormButton').hide();
          }

        }


/*******************************************************************************************************
  OLD REFERENCE CODE BELOW HERE BEEEE - ARRRRR!
*******************************************************************************************************/        
        

/*******************************************************************************************************
  LOGIN STORAGE
*******************************************************************************************************/

/*
        var Creds = new Ext.data.Store({
            model: 'credentials',
            proxy: {
                type: 'sessionstorage',
                id  : 'loginCreds'
            }
        });
*/
        
 /*
       var product = '{ "products" : "yeah"}';
        
        var Creds = new Ext.data.LocalStorageProxy({
          id  : 'loginCreds'
        });
        
        new Ext.data.Store({
            proxy: new Ext.data.LocalStorageProxy({
                id: 'solitaire-games'
            }),
            model: 'Game',
            autoLoad: false,
        
        Creds.add('{ "products" : "yeah"}' );
        Creds.sync();
        
        window.console.log( Creds );
*/
        
        
       /*  localStorage.setItem("title", "My blog title"); */
        

  
  
/*
          var timeline = new Ext.Component({
            title: 'Timeline',
            cls: 'timeline',
            scroll: 'vertical',
            tpl: [
                '<tpl for=".">',
                    '<div class="tweet">',
                            '<div class="avatar"><img src="{profile_image_url}" /></div>',
                            '<div class="tweet-content">',
                                '<h2>{from_user}</h2>',
                                '<p>{text}</p>',
                            '</div>',
                    '</div>',
                '</tpl>'
            ]
        });
*/
  
  
        
/*
        Ext.override(Ext.form.Field, {
            onKeyUp : function(e) {
                this.fireEvent('keyup', this, e);
            }
        });
*/
        
/*
        var map = new Ext.Map({
            title: 'Map',
            getLocation: true,
            mapOptions: {
                zoom: 12
            }
        });
*/        
        
/*
        new Ext.Toolbar({
          dock: 'top',
        });
*/

/*
        var refresh = function() {
            var coords = map.geo.coords;

            Ext.util.JSONP.request({
                url: 'http://search.twitter.com/search.json',
                callbackKey: 'callback',
                params: {
                    geocode: coords.latitude + ',' + coords.longitude + ',' + '5mi',
                    rpp: 30
                },
                callback: function(data) {
                    data = data.results;

                    // Update the tweets in timeline
                    timeline.update(data);

                    // Add points to the map
                    for (var i = 0, ln = data.length; i < ln; i++) {
                        var tweet = data[i];

                        // If the tweet is geo-tagged, use that to display marker
                        if (tweet.geo && tweet.geo.coordinates) {
                            var position = new google.maps.LatLng(tweet.geo.coordinates[0], tweet.geo.coordinates[1]);
                            addMarker(tweet, position);
                        }
                    }
                }
            });
        };
*/

        // These are all Google Maps APIs
/*
        var addMarker = function(tweet, position) {
            var marker = new google.maps.Marker({
                map: map.map,
                position: position
            });
        };
*/

        /* map.geo.on('update', refresh); */


        /* tabBar.addDocked({
            xtype: 'button',
            ui: 'mask',
            iconCls: 'refresh',
            dock: 'right',
            stretch: false,
            align: 'center',
            handler: refresh
        }); */

    }
});


