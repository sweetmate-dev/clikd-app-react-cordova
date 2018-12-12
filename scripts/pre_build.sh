#!/bin/bash

TASK='default';

if [[ $CORDOVA_CMDLINE =~ --release ]]; then
    TASK='release';
fi

echo "Executing webpack";
webpack || exit $?