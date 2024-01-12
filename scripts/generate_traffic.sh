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
URLS+=('https://indeed.com')
URLS+=('https://linkedin.com')
URLS+=('https://www.poki.com')
URLS+=('https://www.1377x.to')
URLS+=('https://pratik.com')
URLS+=('http://pratik.com')
URLS+=('https://expired.badssl.com/')
URLS+=('https://client-cert-missing.badssl.com/')
URLS+=('https://incomplete-chain.badssl.com/')

animate() {
    spin='-\|/'

    # This loop will keep running until killed from the outside
    while :; do
        for i in {0..3}; do
            echo -ne "\r${spin:$i:1} Accessing => ${URL}"
            sleep .1
        done
    done
}

while true; do
    for URL in "${URLS[@]}"; do 
        # Start the animation
        animate &
        ANIMATE_PID=$!

        # Run the curl command
        curl --silent --proxy "${PROXY_IP_PORT}" --cacert "${CA_CERT}" "${URL}" &> /dev/null
        sleep .1

        # Stop the animation
        kill $ANIMATE_PID
        wait $ANIMATE_PID 2>/dev/null
        # Print the accessed message on the same line and overwrite the animation
    done
    echo -ne "\r" # Move the cursor to the start of the line
done