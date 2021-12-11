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

## Examples

| Media Type | Example |
| ---------- | ------- |
| `image/svg` | https://dimensiondev.github.io/Media-Viewer/index.html?url=https://storage.opensea.io/files/8b38f04c8bbe079abb8a8a954ead6f8b.svg |
| `modle/gltf+binary` | https://dimensiondev.github.io/Media-Viewer/index.html?url=https://storage.opensea.io/files/acb109c417a5043f45204fe0c69d2f92.gltf |
| `image/jpeg` | https://dimensiondev.github.io/Media-Viewer/index.html?url=https://lh3.googleusercontent.com/L0h_MmnLMemsF-Y7qM36_PJagkU4-mRT4LONgNcEmyMdUYwPFlNOWQmXmE5gL879pvsnCA_ElZ4em-Juuur99kFb0X6sukuH3f9y4g=w600 |
| `video/mp4` | https://dimensiondev.github.io/Media-Viewer/index.html?url=https://storage.opensea.io/files/11e764af044ac519558db4ceaae837e5.mp4#t=0.001 |
| `audio/mp3` | https://dimensiondev.github.io/Media-Viewer/index.html?url=https://storage.opensea.io/files/959fd620a51c4604723e7b10b99be7f9.mp3 |

## NFT JSON Schema

| Schema | Example |
| ------ | ------- |
| ERC721 JSON Schema | https://dimensiondev.github.io/Media-Viewer/index.html?url=https://www.cyberkongz.com/api/metadata-vx/15 |

## LICENSE

[MIT](LICENSE)
