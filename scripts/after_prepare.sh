#!/bin/bash

npm run config
if [ "$CORDOVA_PLATFORMS" != "android" ]; then
  exit 0
fi
npm run drawables
