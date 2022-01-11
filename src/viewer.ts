import { onError } from './error'
import type { ViewerOptions } from './types'
import { CORS_PROXY } from './constants'

declare global {
  interface Window {
    parentIFrame?: any
    iFrameResizer?: any
  }
}

export async function onView(options: ViewerOptions): Promise<Element | null> {
  let type = options.type
  if (!type) {
    try {
      type = (await getContentType(options.url)) ?? ''
    } catch (error) {
      if (options.url.startsWith(CORS_PROXY)) {
        throw error
      }
      return onView({
        ...options,
        url: `${CORS_PROXY}/?${encodeURIComponent(options.url)}`,
      })
    }
  }
  options.url = prepareURL(options.url)
  const { pathname } = new URL(options.url)

  if (options.source === 'erc721') {
    return onERC721(options)
  }
  if (type.startsWith('image/') || /\.(gif|svg|png|webp|jpg)$/.test(pathname)) {
    return renderImage(options.url)
  }
  if (type.startsWith('audio/') || /\.(mp3|wav|flac|aac)$/.test(pathname)) {
    return renderAudio(options)
  }
  if (type.startsWith('video/') || /\.(mp4|av1|webm)$/.test(pathname)) {
    window.parentIFrame?.sendMessage({ message: { type: 'sourceType', value: 'video' } })
    return renderVideo(options)
  }
  if (type.startsWith('model/') || /\.(stl|gltf)$/.test(pathname)) {
    return renderModel(options)
  }
  if (type === 'application/pdf' || /\.pdf$/.test(pathname)) {
    return renderEmbed(options.url, 'application/pdf')
  }
  if (type.startsWith('text/')) {
    return renderIframe(options.url)
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
  element.muted = options.muted
  return element
}

function renderVideo(options: ViewerOptions) {
  const element = document.createElement('video')
  const url = new URL(options.url)
  if (url.searchParams.get('muted') !== '1' && options.autoPlay) url.searchParams.set('muted', '1')

  element.addEventListener('error', onError)
  element.addEventListener('loadedmetadata', onLoad)
  element.controls = options.controls
  element.autoplay = options.autoPlay
  element.src = url.toString()
  element.playsInline = options.playsInline
  element.loop = options.loop
  element.muted = options.muted
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

function renderIframe(url: string) {
  const element = document.createElement('iframe')
  element.addEventListener('error', onError)
  element.addEventListener('load', onLoad)
  element.src = url
  element.height = '100%'
  element.width = '100%'
  return element
}

function renderEmbed(url: string, type: string) {
  const element = document.createElement('embed')
  element.addEventListener('error', onError)
  element.addEventListener('load', onLoad)
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
    iframe_url?: string
  }
  const payload: Payload = await response.json()
  if (payload.iframe_url) {
    return renderIframe(payload.iframe_url)
  }
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

function onLoad() {
  window.parentIFrame?.size?.()
}
