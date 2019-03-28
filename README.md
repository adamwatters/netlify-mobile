### Netlify Mobile

> iOS app for monitoring and deploying Netlify sites

## Demo

https://expo.io/@adamwatters11/netlify-mobile

## Features

- See all your deployed sites in one place

## Develop

- `git clone https://github.com/adamwatters/netlify-mobile.git`
- [Developing with Expo](https://facebook.github.io/react-native/docs/getting-started.html)
- [Generate new OAuth app credentials](https://app.netlify.com/account/applications)
- `touch dotenv.js` this file is ignored and is where you'll store your OAuth credentials

```
dotenv.js

export const CLIENT_ID =
  "YOUR_CLIENT_ID";
export const SECRET =
  "YOUR_SECRET";
```

## Vision

Hoping to do something like [Git Hawk](https://github.com/GitHawkApp/GitHawk) for [Netlify](https://github.com/netlify)
