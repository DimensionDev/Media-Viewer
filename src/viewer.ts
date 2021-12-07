import type { ViewerOptions } from './types'

declare global {
  interface Window {
    parentIFrame?: any
  }
}

export async function onView(options: ViewerOptions) {
  const type = options.type ?? (await getContentType(options.url)) ?? ''
  const { pathname } = new URL(options.url)
  if (type.startsWith('image/') || /\.(gif|svg|png|webp)$/.test(pathname)) {
    return renderImage(options)
  }
  if (type.startsWith('audio/') || /\.(mp3|wav|flac|aac)$/.test(pathname)) {
    return renderAudio(options)
  }
  if (type.startsWith('video/') || /\.(mp4|av1|webm)$/.test(pathname)) {
    return renderVideo(options)
  }
  if (type.startsWith('model/') || /\.(stl|gltf)/.test(pathname)) {
    return renderModel(options)
  }
  return null
}

function renderImage(options: ViewerOptions) {
  const element = document.createElement('img')
  element.addEventListener('error', onError)
  element.addEventListener('load', onLoad)
  element.loading = 'eager'
  element.src = options.url
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

async function getContentType(url: string) {
  const response = await fetch(url, { method: 'HEAD' })
  return response.headers.get('content-type')
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
