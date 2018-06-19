# react-scripts

Functions for creating and editing React components.

We recommend running these from [@creuna/cli](https://github.com/Creuna-Oslo/cli).

If you want to use these functions from JavaScript, this is the right module for you.

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

## Notes

The functions require a `.creunarc.json` and a `.eslintrc.json` in your project root.

### .creunarc.json

```json
{
  "componentsPath": "relative/path/to/components",
  "mockupPath": "relative/path/to/mockup"
}
```
