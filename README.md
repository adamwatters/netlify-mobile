### Netlify Mobile

> iOS app for monitoring and deploying Netlify sites

## Features

- See all your deployed sites in one place

## Develop

- `git clone https://github.com/adamwatters/netlify-mobile.git`
- [Generate new OAuth app credentials](https://app.netlify.com/account/applications)
- `touch dotenv.js` this file is ignored and is where you'll store your OAuth credentials
- `react-native run-ios`

```
dotenv.js

export const CLIENT_ID =
  "YOUR_CLIENT_ID";
export const SECRET =
  "YOUR_SECRET";
```
