import type { ViewerOptions } from './types'
import { onError, onRejection } from './error'
import { onView } from './viewer'

document.currentScript?.remove()

const { searchParams } = new URL(location.href)

if (searchParams.get('url')) {
  const options: ViewerOptions = {
    url: searchParams.get('url')!,
    type: searchParams.get('type'),
    source: searchParams.get('source'),
    controls: Boolean(searchParams.get('controls') ?? true),
    autoPlay: Boolean(searchParams.get('autoplay') ?? false),
  }
  onView(options).then(inject)
} else {
  window.addEventListener('message', onMessage, false)
  window.addEventListener('error', onError, false)
  window.addEventListener('unhandledrejection', onRejection, false)
  window.addEventListener('rejectionhandled', onRejection, false)
}

let origin: string | undefined

function onMessage(event: MessageEvent<ViewerOptions>) {
  origin = event.origin
  const { data } = event
  if (!data.url) {
    return
  }
  const options: ViewerOptions = {
    url: data.url,
    type: data.type ?? null,
    source: data.source,
    controls: Boolean(data.controls ?? true),
    autoPlay: Boolean(data.autoPlay ?? false),
  }
  onView(options).then(inject)
}

function inject(element: Element | null) {
  if (!element) {
    return
  }
  document.body = document.createElement('body')
  document.body.appendChild(element)
}
