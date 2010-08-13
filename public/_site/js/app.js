Ext.namespace('app', 'shows', 'sales', 'settings', 'Ext.ux');

Ext.setup({
  tabletStartupScreen: 'tablet_startup.png',
  phoneStartupScreen: 'phone_startup.png',
  icon: 'icon.png',
  glossOnIcon: false,
  onReady: function() {
    app.Main.init();
  }
});

app.Main = {
  
  init : function() {
  
    var formLoggedIn = '<form class="login"><p class="alert good"><strong>Logged in as JordanDobson</strong></p><a href="#" class="submit">Log Out</a></form>';
    
    var formLogin = '<form class="login"><div class="group"><input placeholder="Username" value="" name="username" type="email" autocapitalize="off" autocorrect="off" /><input placeholder="Password" value="" name="password" type="password" /></div><a href="#" class="submit">Log In</a></form>';
    
    var formLoginError = '<form class="login"><p class="alert error"><strong>Sorry, the info you provided is incorrect.</strong></p><div class="group"><input placeholder="Username" value="" name="username" type="email" autocapitalize="off" autocorrect="off" /><input placeholder="Password" value="" name="password" type="password" /></div><a href="#" class="submit">Log In</a></form>';
  
    var tabPan = new Ext.TabPanel({
        tabBar: {
          dock:   'bottom',
          layout: { pack: 'center' }
        },
        activeItem: 0,
        fullscreen: true,
        ui:         'dark',
        sortable:   false,
        items: [{
            title:  'Settings',
            html:   formLogin,
            cls:    'cls_shows'
        }, {
            title:  'Error',
            html:   formLoginError,
            cls:    'cls_sales'
        }, {
            title:  'Logged In',
            html:   formLoggedIn,
            cls:    'cls_settings'
        }]
    });    
  }
};


