# SafeSquid_Troubleshooting_Interface
Troubleshooting Made easier by SafeSquid.

This project helps to debug and troubleshoot issues related to any website or application just from your web interface.
For users who are not so comformatble with command line interface can only easy troubleshoot issues simply from there browser.

To start using the project follow below steps:
1. Install websocketd
```
apt update && apt install websocketd
```
2. Clone the project
3. Initalize weboscket connection
```
websocketd --port=8081 --loglevel=debug  --staticdir=<git_clone_directory>/SafeSquid_Troubleshooting_Interface/net_analyzer/ --dir=<git_clone_directory>/SafeSquid_Troubleshooting_Interface/net_analyzer/scripts/
```
