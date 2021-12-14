import type { ViewerOptions } from './types'

declare global {
  interface Window {
    parentIFrame?: any
  }
}

export async function onView(options: ViewerOptions): Promise<Element | null> {
  let type = options.type
  if (!type) {
    try {
      type = (await getContentType(options.url)) ?? ''
    } catch {
      if (options.url.startsWith('https://cors.r2d2.to')) {
        return null
      }
      return onView({
        ...options,
        url: `https://cors.r2d2.to/?${encodeURIComponent(options.url)}`,
      })
    }
  }
  options.url = prepareURL(options.url)
  const { pathname } = new URL(options.url)
  if (options.source === 'erc721') {
    return onERC721(options)
  }
  if (type.startsWith('image/') || /\.(gif|svg|png|webp)$/.test(pathname)) {
    return renderImage(options.url)
  }
  if (type.startsWith('audio/') || /\.(mp3|wav|flac|aac)$/.test(pathname)) {
    return renderAudio(options)
  }
  if (type.startsWith('video/') || /\.(mp4|av1|webm)$/.test(pathname)) {
    return renderVideo(options)
  }
  if (type.startsWith('model/') || /\.(stl|gltf)$/.test(pathname)) {
    return renderModel(options)
  }
  if (type === 'application/pdf' || /\.pdf$/.test(pathname)) {
    return renderEmbed(options.url, 'application/pdf')
  }
  return null
}

function renderImage(url: string) {
  const element = document.createElement('img')
  element.addEventListener('error', onError)
  element.addEventListener('load', onLoad)
  element.loading = 'eager'
  element.src = url
  return element
}

function renderAudio(options: ViewerOptions) {
  const element = document.createElement('audio')
  element.addEventListener('error', onError)
  element.addEventListener('loadedmetadata', onLoad)
  element.src = options.url
  element.controls = options.controls
  element.autoplay = options.autoPlay
  return element
}

function renderVideo(options: ViewerOptions) {
  const element = document.createElement('video')
  element.addEventListener('error', onError)
  element.addEventListener('loadedmetadata', onLoad)
  element.src = options.url
  element.controls = options.controls
  element.autoplay = options.autoPlay
  return element
}

function renderModel(options: ViewerOptions) {
  const element = document.createElement('model-viewer')
  element.addEventListener('error', onError)
  element.addEventListener('load', onLoad)
  element.setAttribute('src', options.url)
  element.setAttribute('auto-rotate', '')
  element.setAttribute('ar', '')
  if (options.controls) {
    element.setAttribute('camera-controls', '')
  }
  return element
}

function renderEmbed(url: string, type: string) {
  const element = document.createElement('embed')
  element.src = url
  element.type = type
  element.height = '100%'
  element.width = '100%'
  element.setAttribute('frameborder', '0')
  element.setAttribute('scrolling', '0')
  return element
}

async function onERC721(options: ViewerOptions) {
  const response = await fetch(options.url, { method: 'GET', mode: 'cors' })
  interface Payload {
    name: string
    description: string
    image: string
  }
  const payload: Payload = await response.json()
  return onView({
    ...options,
    source: null,
    url: prepareURL(payload.image),
  })
}

async function getContentType(url: string) {
  if (!/^https?:/.test(url)) {
    return null
  }
  const response = await fetch(url, { method: 'HEAD', mode: 'cors' })
  if (response.status !== 200) {
    throw new Error(response.statusText)
  }
  return response.headers.get('content-type')
}

function prepareURL(url: string) {
  if (url.startsWith('ipfs://')) {
    // https://developers.cloudflare.com/distributed-web/ipfs-gateway
    return url.replace(/^ipfs:\/\/(ipfs\/)?/, 'https://ipfs.foundation.app/ipfs/')
  }
  return url
}

function onError(this: Element, event: ErrorEvent) {
  this.remove()
  const element = document.createElement('p')
  element.className = 'error-message'
  element.textContent = event.message
  document.body.appendChild(element)
}

function onLoad() {
  window.parentIFrame?.resize()
}
