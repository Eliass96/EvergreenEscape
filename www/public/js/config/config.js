document.addEventListener('deviceready', function () {

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    var config = {
        "plugins": {
            "statusbar": {
                "visible": false,
                "backgroundColor": "#000000"
            },
            "navigationbar": {
                "visible": false,
                "backgroundColor": "#ffffff"
            }
        }
    };

    if (isMobile) {
        const NavigationBar = require('@ionic-native/navigation-bar/ngx').NavigationBar;

        function adjustContent() {
            const width = window.innerWidth;
            const height = window.innerHeight;

            // Adjust content styles based on width and height
            document.body.style.width = width + 'px';
            document.body.style.height = height + 'px';
        }

        function lockLandscapeOrientation() {
            screen.orientation.lock('landscape');
        }

        if (config.plugins.statusbar.visible === false) {
            StatusBar.hide();
        }

        if (config.plugins.navigationbar.visible === false) {
            // Use the appropriate function based on plugin implementation
            if (NavigationBar) {
                NavigationBar.getPlugin().hideNavigationBar();
            } else {
                console.warn("NavigationBar plugin not found or not imported correctly.");
            }
        }

        window.addEventListener('resize', adjustContent);
        lockLandscapeOrientation();

        adjustContent();
    }
})
