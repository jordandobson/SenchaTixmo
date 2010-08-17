/* 

  THINGS TO DO

    * Store login & api_key upon successful login
    * Make sure api_key & login are stored over application uses
    * Check api_key and login to decide screen to view
    * Add in a Timeout for login attempt
    * Add Logout Functionality
    
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

        var loadingMarkup   = '<div class="wrapper"><div class="spins"><span class="t"></span><span class="r"></span><span class="b"></span><span class="l"></span></div></div>';
        
        var loginSuccessMsg = 'Logged in as ';
        var loginFailureMsg = 'Sorry, the info you provided is incorrect.';
        var loginErrorMsg   = 'Sorry, an unknown error occured. Try Again.';
        var loginBlankMsg   = 'Please fill in both username and password.';
        var logoutMsg       = 'You are logged out.';
        

        var attemptLogin = function(){
        
        // Blur Inputs So keyboard Hides
          var loginInputs = document.getElementsByTagName("input");
          loginInputs[0].blur();
          loginInputs[1].blur();
        
        // Clear the alert text          
          Ext.getCmp('loginAlertTxt').update('');
          
        // Get the Values of the login fields
          fields = loginPanel.getValues();
          
        // Cancel form if either fields are empty and display message
          if (fields.login == "" || fields.password == ""){
            Ext.getCmp('loginAlertTxt').update( '<p class="blank"><strong>' + loginBlankMsg + '</strong></p>' );
            return false;
          }

        // Show Loading Display
          Ext.getBody().mask(false, loadingMarkup);

          Ext.Ajax.request({
              url:      '/login.json',
              params:   loginPanel.getValues(),
              success:  function(response, opts) {
              
              // Decode & Store JSON Response
                res = Ext.decode(response.responseText);
                usr = res.login;
                key = res.api_key;
                
              // Update The Success Message
                Ext.getCmp('loginAlertTxt').update( '<p class="success"><strong>' + loginSuccessMsg + usr + '</strong></p>' );

              // Hide Login Elements & Show Logout Button
                Ext.getCmp('loginFormFields').hide();
                Ext.getCmp('loginFormButton').hide();
                Ext.getCmp('logoutFormButton').show();
                
              // Hide Loading Display
                Ext.getBody().unmask();

              // Display the tab bar & Shows Panel
                panel.setCard(0, null);
                tabBar.show('fade');
                
              },
              failure:  function(response, opts){
                
              // Show Failure Message              
                Ext.getCmp('loginAlertTxt').update( '<p class="failure"><strong>' + loginFailureMsg + '</strong></p>' );
                
              // Hide Loading Display
                Ext.getBody().unmask();
              }
          })
        };
        
        var logoutUser = function(){
          tabBar.hide('fade');
          Ext.getCmp('loginAlertTxt').update( '<p class="notify"><strong>' + logoutMsg + '</strong></p>' );
          Ext.getCmp('loginFormFields').show();
          Ext.getCmp('loginFormUsername').setValue('');
          Ext.getCmp('loginFormPassword').setValue('');
          Ext.getCmp('loginFormButton').show();
          Ext.getCmp('logoutFormButton').hide();
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
          if(val == 13){ attemptLogin();}
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
                name :          'login',
                placeholder:    'Username',
                value:          'jordandobson',                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
                baseCls:        'x-plain',
                cls:            'custom',
                listeners:{     keyup: function(thisField, e) { checkForEnter(e.browserEvent.keyCode, this); } }
              },{
                xtype:          'passwordfield',
                id:             'loginFormPassword',
                name :          'password',
                placeholder:    'Password',
                value:          'awesome',
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

      // Hide Logout Button
        Ext.getCmp('logoutFormButton').hide();        
        
      // Show Login Panel
        panel.setCard(2, 'fade');
        
        
/*******************************************************************************************************
  OLD REFERENCE CODE
*******************************************************************************************************/
        
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


