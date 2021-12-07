# Media Viewer

## Using

```typescript
const frame = document.createElement('iframe')
frame.src = 'https://dimensiondev.github.io/Media-Viewer/'
frame.addEventListener('load', () => {
  frame.contentWindow.postMessage({
    url: 'a media resource link',
    type: 'the media file mime', // optional
    controls: true, // optional, allow user-control audio/video
  })
})
// append the `frame` object to target element
```

## LICENSE

[MIT](LICENSE)
