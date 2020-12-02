# remoteappmanager
Downloads and installs apps from your Steam library on a remote machine. This is mainly intended for those who can't access their library page on the web.

## Caveat
Steam will pick your EARLIEST login as the remote target to install to. For example, if you logged in on Computer A on Tuesday and Computer B on Wednesday, Computer A will take precedence. You can fix this by logging out of the client on Computer A and logging back in.

Also, exiting via Ctrl+C, etc will not stop the download on the remote computer.

## Install and run
```
git clone git@github.com:antigravities/remoteappmanager.git
cd remoteappmanager
npm install
node index.js -a [appid] -u [your account name] -p '[your account's password]'
```

## License
AGPL 3.0. See the LICENSE file.
