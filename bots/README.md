# paname-functions

## __How-to__
### 💻  Emulate functions locally 
- `cd functions && npm run serve`
### 📡 Deploy to Firebase Functions
- `firebase deploy --only functions --project paname-next`
### Set-up .env
- `firebase functions:config:set proxy.address [proxy-adress] --project paname-next`      
*proxy-address format:* `http://{username}:{password}@{hostname/ip}:{port}`
#### Others values to set
- `webhooks.entry`
- `webhooks.error`
- `captcha.anti`
- `captcha.twocap`
- `cloudrun.url`
### Set-up .env.local
- `cd functions`
- Rename `.runtimeconfig.example.json` to `.runtimeconfig.json`
- Modify it to your needs

## __TODO__
Write:     
- Local test      
✅ Launch emulators       
✅ Test functions     
- Prod testing
✅ Communicating with Firestore     
❌ CRON      
❌ Sending results to API (in a Task Entity)   

## __Modules documentation__

- [Global Agent (Proxy)](https://github.com/gajus/global-agent)
- [got requests](https://github.com/sindresorhus/got)
