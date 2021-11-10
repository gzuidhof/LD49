# Beamer

A web server for this LD49 game, based on the Sunder template.

It is hosted on [Cloudflare Workers](https://workers.cloudflare.com) with the following configuration:

* The [Sunder](https://sunderjs.com) minimal web framework.
* [ESBuild](https://esbuild.github.io/) for builds in <50ms (through [Estrella](https://github.com/rsms/estrella)).
* [Typescript](https://www.typescriptlang.org/) for typechecking.

If you disagree with any of these choices it should be possible to swap out that decision.

## 🚀 Getting started

Press the green *"Use this template"* button in the top right to make a Github repository based on this one.

## Development

To watch changes and build as you go, use 
```
npm run watch
```

To make a production build use
```
npm run build
```

### Testing

The tests are run using Jest. Use `npm test` to run your tests.

To re-run the tests on changes run
```
npm test -- --watch
```

This is the recommended way to develop most of your app. Write tests for core functionality instead of relying on `wrangler dev`.

> ⚠️ Jest runs tests in a Node environment, this template has polyfills that make this environment as close as possible to a normal Cloudflare environment, but it may still be slightly different.

### Previewing and Publishing
```
wrangler dev
```

This is best combined with `npm run watch` in another terminal so the build gets updated automatically. Please make sure to call `npm run watch` first.

To publish, first make a build using `npm run build` and then use the Wrangler CLI tool.
