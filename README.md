# foxyext
Web Extension for Foxy Agent

This is the extension that communicates with the foxycli.  It uses Web Extension Native Messaging to pass messages to the client. The Web Extension will take actions inside the browser such as displaying the weather, showing a timer, based on voice utterances from the user that begin with "Hey Foxy".

Note: foxycli must be installed before the extension can function properly.

The Web Extension needs to be configured for the NativeMessaging to be able to find and start the native app (in this case, foxycli).

1.  Modify foxycli.json paths to point to the correct location for where you have foxycli installed.  The startup.sh script launches the client processes.
2.  Place foxycli.json in the location: /Library/Application Support/Mozilla/NativeMessagingHosts/foxycli.json

The FoxyExt can be started by:
1.  Go to about:debugging in Firefox.  
2.  Click on "Add-ons" on the left side.
3.  Check "Enable Add-on Debugging" if it's not already checked.
4.  Choose "Load Temporary Add-on" and then browse to foxyext and select any file and it will start the extension and the native app foxycli.
