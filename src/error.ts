export function onError(event: ErrorEvent) {
  const error: Error = event.error
  postMessage({
    type: event.type,
    name: error.name,
    reason: error.message,
    stack: error.stack,
  })
}

export function onRejection(event: PromiseRejectionEvent) {
  const error: Error = event.reason
  postMessage({
    type: event.type,
    name: error.name,
    reason: error.message,
    stack: error.stack,
  })
}

function postMessage(data: unknown) {
  if (!origin) return
  if (window.parentIFrame) {
    window.parentIFrame.sendMessage(data)
  } else {
    const target = window.parent ?? window
    target.postMessage(data, origin)
  }
}
