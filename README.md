# react-scripts

Scripts for creating and edting React components.

We recommend running these from [@creuna/cli](https://github.com/Creuna-Oslo/cli)

### Install

```
yarn add -g '@creuna/cli'
```

### Usage

```
creuna <script-name>
```

### Scripts

- component: Create new component
- page: Create new mockup page
- rename: Rename component
- stateful: Convert component to stateful
- stateless: Convert component to stateless

### Notes

The scripts require a `.creunarc.json` and a `.eslintr.json` in your project root.

#### .creunarc.json

```json
{
  "componentsPath": "relative/path/to/components",
  "mockupPath": "relative/path/to/mockup"
}
```
