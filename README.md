# Media Viewer

## Usage

### HTML

```html
<iframe src="https://media-viewer.r2d2.to/index.html?url=[media_link]" />
```

### JavaScript

```typescript
const frame = document.createElement('iframe')

frame.addEventListener('load', () => {
  frame.contentWindow.postMessage({
    type: '[media_type]', // optional
    url: '[media_link]',
    controls: true, // optional, allow user-control audio/video
  })
})
frame.src = 'https://media-viewer.r2d2.to/index.html'
document.body.appendChild(frame)
```

## Examples

| Media Type          | Example                                                                                                                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `image/svg`         | <https://media-viewer.r2d2.to/index.html?url=https://storage.opensea.io/files/8b38f04c8bbe079abb8a8a954ead6f8b.svg>                                                                         |
| `modle/gltf+binary` | <https://media-viewer.r2d2.to/index.html?url=https://storage.opensea.io/files/acb109c417a5043f45204fe0c69d2f92.gltf>                                                                        |
| `image/jpeg`        | <https://media-viewer.r2d2.to/index.html?url=https://lh3.googleusercontent.com/L0h_MmnLMemsF-Y7qM36_PJagkU4-mRT4LONgNcEmyMdUYwPFlNOWQmXmE5gL879pvsnCA_ElZ4em-Juuur99kFb0X6sukuH3f9y4g=w600> |
| `video/mp4`         | <https://media-viewer.r2d2.to/index.html?url=https://storage.opensea.io/files/11e764af044ac519558db4ceaae837e5.mp4#t=0.001>                                                                 |
| `audio/mp3`         | <https://media-viewer.r2d2.to/index.html?url=https://storage.opensea.io/files/959fd620a51c4604723e7b10b99be7f9.mp3>                                                                         |

## NFT JSON Schema

| Schema             | Example                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------- |
| ERC721 JSON Schema | <https://media-viewer.r2d2.to/index.html?url=https://www.cyberkongz.com/api/metadata-vx/15&source=erc721> |

## Parameters

| Name          | Type        | Description                                                                                                             |
| ------------- | ----------- | -----------------------------------------------------------------------------------------------------------------------
| `url`         | string      | Resource url, or tokenURI if `source === 'erc721'`.                                                                     |
| `type`        | string      | Predefined content type of the resource to determine which html element to render, if it is absent *Media-Viewer* will get the content type from response header |
| `source`      | 'erc721'    | if  `source === 'erc721'`, *Media-Viewer* will treat `url` as a tokenURI                                                  |
| `controls`    | boolean     | html5 video option. |
| `autoPlay`    | boolean     | html5 video option. |
| `playsInline` | boolean     | html5 video option. |
| `loop`        | boolean     | html5 video option. |
| `muted`       | boolean     | html5 video option. |
| `erc721Token` | ERC721Token | if `url` is provided, *Media-Viewer* will ignore this parameter, otherwise it will fetch the NFT resource by the `tokenId` and `address` of `erc721Token` through its `rpc`. |

```typescript
interface ERC721Token {
    contractAddress: string
    tokenId: string
    rpc: string // the rpc url to send request to the relative chain.
}
```


## LICENSE

[MIT](LICENSE)
