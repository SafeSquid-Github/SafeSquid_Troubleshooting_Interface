#!/bin/bash

PROXY_IP_PORT="127.0.0.1:8080"
CA_CERT="/usr/local/safesquid/security/ssl/ROOT_X509File.cer"
OUT="/dev/null"

URLS+=('https://google.com')
URLS+=('https://yahoo.com')
URLS+=('https://facebook.com')
URLS+=('https://bing.com')
URLS+=('https://duckduckgo.com')
URLS+=('https://instagram.com')

while true
do  
    for URL in ${URLS[@]}
    do 
        curl --silent --proxy ${PROXY_IP_PORT} --cacert ${CA_CERT}  "${URL}" -D - -o ${OUT};  
    done
done