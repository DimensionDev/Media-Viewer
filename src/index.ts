import type { ViewerOptions } from './types'
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
  window.addEventListener('unhandledrejection', onUnhandledRejection, false)
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

function onError(event: ErrorEvent) {
  if (!origin) return
  const data = { type: 'error', reason: event.message }
  window.postMessage(data, origin)
}

function onUnhandledRejection(event: PromiseRejectionEvent) {
  if (!origin) return
  const data = { type: 'unhandledrejection', reason: event.reason }
  window.postMessage(data, origin)
}

function inject(element: Element | null) {
  if (!element) {
    return
  }
  document.body = document.createElement('body')
  document.body.appendChild(element)
}
