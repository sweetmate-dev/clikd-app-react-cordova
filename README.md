# CLiKD

## Contents

1. [Introduction](#introduction)
1. [Development](#development)
1. [Notes](#notes)
1. [Troubleshooting](#troubleshooting)

## Introduction

This app is built using React.js on top of Cordova.  It uses:

* Node 8.x.x
* Cordova 6.x.x
* Webpack

The app connects to a PHP based backed via an API.  It also implements a chat service by connecting to an Ejabberd 
XMPP server using the stanza.io library

## Development

### Getting started

#### Install dependencies

The following dependencies need to be installed in order to buld the app.

##### Node 8.x.x

Node can be installed using nvm [https://github.com/creationix/nvm](https://github.com/creationix/nvm) or as a 
package on Ubuntu by running:

```
curl -sL https://deb.nodesource.com/setup_8.x | sudo bash -
```

#### Install required node modules

```
npm install
```

##### Java 8.x.x (required for Android builds)

On Ubuntu run:

```
sudo add-apt-repository ppa:webupd8team/java
sudo apt update
sudo apt install oracle-java8-set-default
```

##### Gradle

See install instructions at [https://gradle.org/install/](https://gradle.org/install/)

##### Android Studio & SDKs

Download and install Android Studio from [https://developer.android.com/studio/](https://developer.android.com/studio/).

Once installed run Android Studio and on the startup screen select Configure > SDK Manager.  From the SDK manager:

* Under SDK Platfroms, install the latest API (28) and Android 8.0 (API Level 26)
* Under SDK Tools, make sure Android SDK Tools are installed

Make sure JAVE_HOME and ANDROID_HOME are configured in your ~/.bashrc - see 
[https://cordova.apache.org/docs/en/latest/guide/platforms/android/](https://cordova.apache.org/docs/en/latest/guide/platforms/android/) 
for more info.


### Developing using the webpack dev server

The best way to develop the app is by running the Cordova browser plugin and using the webpack dev server.  

First you need to add the Cordova browser platform (you only need to do this once):

```
npm run prepare:browser
```

To start the dev server:

```
npm run start
```

This will create a hot loading environment at http://localhost:8080

### Bulding for Android

Add the Cordova android platform (you only need to do this once):
                                 
```
npm run prepare:android
```

The following scripts are then available:

* ```npm run build:android``` - create apk
* ```npm run run:android``` - create apk and load onto the default attached device
* ```npm run emulate:android``` - build app and run on the android emulator

### Bulding for IOS

Before building for iOS run:

```
npm install ios-deploy -g
```

Add the Cordova ios platform (you only need to do this once):
                                 
```
npm run prepare:ios
```

The following scripts are then available:

* ```npm run build:ios``` - build the app
* ```npm run emulate:ios``` - build app and run on the default iOS emulator

Once the app is built you can open the project within XCode by clicking on the generated Clikd.xcworkspace.  Builds
can be created from Xcode to push to the app store.


#### Addtitonal node scripts


* ```npm run resources``` - builds the splashcreen
* ```npm run drawables``` - builds the icons

#### Setting the environment

Switch between environments by setting the NODE_ENV environment variable when running build scripts.  
The default environment is 'satging', so for most intents you'll only ever need to set this to `production` e.g.

* ```NODE_ENV=production npm run start``` - run dev server using production APIs
* ```NODE_ENV=production npm run build:android``` - Build android apk for production

## Notes

### Config.xml

The Cordova config in the root of the project is generated from `/config/config.base.xml` and should not be edited directly.

### Project relative imports

To avoid writing relative imports for common components you can use the ^ symbol to denote a module relative to the project root.

For example

    import '^/components/layout/Screen'
    // Will always resolve to to app/components/layout/screen
    
    import './components/GridListItem'
    // Resolves to the 'component' directory relative to the module doing the import
    
### To get working in safari browser on mac when using npm run start
 To avoid errors, in app/Clikd.js comment out the following lines
 
    Geolocation.init(store);
    PushService.init(store);
    TestFairy.init(store);
    
## Troubleshooting

### Known issues / workarounds

If it hangs on the clikd app, ensure to install:

```
sudo apt-get install libkrb5-dev
```

Also, ```build-essential``` may be useful to install if that does not work.

We have been using ```nvm``` and node v 4.6.0 which can be installed via ```nvm install 4.6.0```
    
### ios deploy issues

If you get an error saying **ios-deploy not found** when trying to deploy to an ios device then try running:

```
npm install --global --unsafe-perm ios-deploy
npm install ios-sim -g
```

### ios build issues

npm install

npm run prepare

open **Clikd.xcworkspace** Xcode and enable push notifications and set dev teams etc.

```
NODE_ENV=production npm run build:ios
```

if error: 
```
Error: Cannot find module '../../node_modules/xcode'
```

edit this file: 
```
plugins/cordova-plugins-firebase-hooks/hooks/ios/copy-google-services.js
```

change these lines
```diff
-      xcode = context.requireCordovaModule('cordova-lib/node_modules/xcode'),
-      plist = context.requireCordovaModule('cordova-lib/node_modules/plist');
+      xcode = context.requireCordovaModule('xcode'),
+      plist = context.requireCordovaModule('plist');
```

```
NODE_ENV=production npm run build:ios
```

if error: 

```
fatal error: 'GoogleCloudMessaging.h' file not found
#import "GoogleCloudMessaging.h"
```

alter this file: ```platforms/ios/Podfile```

to look like this:

```diff
# DO NOT MODIFY -- auto-generated by Apache Cordova
platform :ios, '8.0'
target 'Clicked' do
project 'Clikd.xcodeproj'
+ pod 'GoogleCloudMessaging', '~> 1.2.0'
+ pod 'GGLInstanceID', '~> 1.2.1'
pod 'Firebase/Analytics'
end

```

then run in the same directory run this:

```
pod install
```

then run in the app root

```
NODE_ENV=production npm run build:ios
```