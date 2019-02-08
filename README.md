# Steps

1. Install react. ```create-react-app pwa-presentation```
2. Install web-push globally. ```npm i -g web-push```
3. Install ```cra-append-sw``` and ```dotenv```.
4. Generate VAPID keys ```web-push generate-vapid-keys```.
5. Copy keys to ```.env``` file.
6. Create api key for this app on https://console.developers.google.com/
7. Copy this key ```.env``` file.
8. Add custom service worker. (e.g. ```./src/custom-sw.js```)
9. Update package json for start & build to use the following scripts:
    ```
        "start": "react-scripts start && cra-append-sw --mode dev ./src/custom-sw.js",
        "build": "react-scripts build && cra-append-sw ./src/custom-sw.js",
    ```
10. Register service workers in ```index.js```