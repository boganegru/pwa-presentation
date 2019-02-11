# Steps

1. Install react. ```create-react-app pwa-presentation```
2. Install web-push globally. ```npm i -g web-push```
3. Install ```cra-append-sw``` and ```dotenv```.
4. Generate VAPID keys ```web-push generate-vapid-keys```.
5. Copy keys to ```.env``` file.
6. Create api key for this app on https://console.developers.google.com/
7. Copy this key ```.env``` file.
8. Add custom service worker. (e.g. ```./src/custom-sw.js```)
9. Update package json for build to use the following script:
    ```
        "build": "react-scripts build && cra-append-sw ./src/custom-sw.js",
    ```
10. Register service workers in ```index.js```
11. Crate the converted VAPID key using this function: 
    This function I copied from google code labs: https://github.com/GoogleChromeLabs/web-push-codelab/blob/master/app/scripts/main.js
    ```js
    const convertedVapidKey = urlBase64ToUint8Array(process.env.REACT_APP_VAPID_PUBLIC);
    
    function urlBase64ToUint8Array(base64String) {
        const padding = "=".repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
    
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
    ```
12. On your component's ```componentDidMount```, request for permission and subscribe to notifications:
    You can trigger this anywhere you want, but for this example I put it here.
    ```js
    componentDidMount() {
        Notification.requestPermission(function(status) {
            console.log('Notification permission status:', status);
        });

        navigator.serviceWorker.ready.then(registration => {

            if (!registration.pushManager) {
                alert("Push Unsupported")
                return
            }
            registration.pushManager.subscribe({
                userVisibleOnly: true, //Always display notifications
                applicationServerKey: convertedVapidKey
            })
                .then(subscription => this.setState({subscription: JSON.stringify(subscription)}))
                .catch(err => console.error("Push subscription error: ", err));
        })
    }
    ```
13. Now you could show the subscription on the screen for testing purposes, or you can create a notification pusher service where you send this subscription object and keep it for future notifications.
14. The notification sender should look something like this: 
    ```js
    const webpush = require("web-push");
    const env = require('dotenv').load();
    console.log(env);
    webpush.setGCMAPIKey(env.parsed.REACT_APP_GOOGLE_API_KEY);
    webpush.setVapidDetails(
        "mailto:yourmail@example.com",
        env.parsed.REACT_APP_VAPID_PUBLIC,
        env.parsed.REACT_APP_VAPID_PRIVATE
    );
    
    const subscription = {'the subscription object here'};

    const testData = "This is my message for you";
    
    webpush.sendNotification(subscription, JSON.stringify(testData)).then((res) => console.log(res)).catch((e) => console.error(e));

    ```
    
# References:
1. Google Presentation: https://developers.google.com/web/progressive-web-apps
    * Check the youtube video there: https://youtu.be/m-sCdS0sQO8
2. PWA Training: https://developers.google.com/web/ilt/pwa/
3. Lab for push notifications: https://developers.google.com/web/ilt/pwa/lab-integrating-web-push
4. Another tutorial to help kick off with the react push notifications https://medium.com/@jasminejacquelin/integrating-push-notifications-in-your-node-react-web-app-4e8d8190a52c
5. Some more about service workers: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers