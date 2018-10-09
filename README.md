# react-scripts

Functions for creating and editing React components.

We recommend running these from [@creuna/cli](https://github.com/Creuna-Oslo/cli).

If you want to use these functions from Node.js, this is the right module for you.

## API

This module exports one object containing all the functions.

```javascript
{
  newComponent, // Create new component
  newPage, // Create new mockup page
  rename, // Rename component
  toStateful, // Convert component to stateful
  toStateless; // Convert component to stateless
}
```

## Eslint config

If you have `settings.react.version` set in your eslint config, it's really important that the version follows the format described in the [docs](https://www.npmjs.com/package/eslint-plugin-react). If the wrong format is used, the scripts might not work.