import now from 'es-now'

frameDuration = 1000 / 60
id            = 0
last          = 0
queue         = []

export raf = (callback) ->
  if queue.length == 0
    now_ = now()
    next = Math.max(0, frameDuration - (now_ - last))
    last = next + now_

    setTimeout ->
      cp = queue.slice(0)

      # Clear queue here to prevent callbacks from appending listeners to the
      # current frame's queue
      queue.length = 0

      for x in cp
        unless x.cancelled
          try
            x.callback last
          catch err
            setTimeout ->
              throw err
            , 0
      return
    , Math.round next
  queue.push
    handle:    ++id
    callback:  callback
    cancelled: false
  id

export caf = (handle) ->
  for x in queue
    if x.handle == handle
      x.cancelled = true
  return

root = if typeof window == 'undefined' then global else window

export requestAnimationFrame = root.requestAnimationFrame ? raf
export cancelAnimationFrame  = root.cancelAnimationFrame  ? caf
