import type { ViewerOptions, ViewerRawOptions, ViewerERC721TokenOptions, } from './types'
import { onError, onRejection } from './error'
import { onView } from './viewer'
import { onERC721Parse } from './erc721Parse'

document.currentScript?.remove()

const { searchParams } = new URL(location.href)

if (searchParams.get('url') || searchParams.get('erc721Token')) {
  const options: ViewerRawOptions = {
    url: searchParams.get('url')!,
    type: searchParams.get('type'),
    source: searchParams.get('source'),
    controls: Boolean(searchParams.get('controls') ?? true),
    autoPlay: Boolean(searchParams.get('autoplay') ?? true),
    playsInline: Boolean(searchParams.get('playsInline') ?? false),
    loop: Boolean(searchParams.get('loop') ?? true),
    muted: Boolean(searchParams.get('muted') ?? true),
    erc721Token: searchParams.get('erc721Token') ? JSON.parse(searchParams.get('erc721Token')!) : null
  }
  onParse(options)

} else {
  window.iFrameResizer = {
    onMessage,
  }
  window.addEventListener('error', onError, false)
  window.addEventListener('unhandledrejection', onRejection, false)
  window.addEventListener('rejectionhandled', onRejection, false)
}

function onMessage(data: ViewerOptions) {
  const options: ViewerOptions = {
    url: data.url,
    type: data.type ?? null,
    source: data.source,
    controls: Boolean(data.controls ?? true),
    autoPlay: Boolean(data.autoPlay ?? true),
    playsInline: Boolean(data.playsInline ?? false),
    loop: Boolean(data.loop ?? true),
    muted: Boolean(data.muted ?? true),
    erc721Token: data.erc721Token,
  }
  onParse(options)
}

function inject(element: Element | null) {
  if (!element) {
    return
  }
  document.body = document.createElement('body')
  document.body.appendChild(element)
}

function onParse(options: ViewerRawOptions) {
  if (!options.url && options.erc721Token) {
    onERC721Parse(options as ViewerERC721TokenOptions).then(inject)
  } else if (options.url) {
    onView(options as ViewerOptions).then(inject)
  } else {
    return
  }
}
