import { useEffect, useRef, useCallback } from 'react'

class FrameSequence {
  constructor(canvas, framePaths, onProgress) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.framePaths = framePaths
    this.images = []
    this.loaded = 0
    this.onProgress = onProgress || (() => {})
    this.currentIndex = 0
    this._ready = false
  }

  preload() {
    return new Promise((resolve) => {
      if (this.framePaths.length === 0) { this._ready = true; resolve(); return }
      this.framePaths.forEach((src, i) => {
        const img = new Image()
        img.onload = () => {
          this.loaded++
          this.onProgress(this.loaded, this.framePaths.length)
          if (this.loaded === this.framePaths.length) {
            this._ready = true
            this.draw(0)
            resolve()
          }
        }
        img.onerror = () => {
          this.loaded++
          this.onProgress(this.loaded, this.framePaths.length)
          if (this.loaded === this.framePaths.length) {
            this._ready = true
            this.draw(0)
            resolve()
          }
        }
        img.src = src
        this.images[i] = img
      })
    })
  }

  draw(index) {
    if (!this._ready) return
    const img = this.images[Math.max(0, Math.min(index, this.images.length - 1))]
    if (!img?.complete || img.naturalWidth === 0) return
    const { canvas, ctx } = this
    const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight)
    const sw = img.naturalWidth * scale
    const sh = img.naturalHeight * scale
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, (canvas.width - sw) / 2, (canvas.height - sh) / 2, sw, sh)
    this.currentIndex = index
  }

  scrub(progress) {
    if (!this._ready || this.images.length === 0) return
    const maxIdx = this.images.length - 1
    const raw = progress * maxIdx
    const lo = Math.floor(raw)
    const hi = Math.min(lo + 1, maxIdx)
    const t = raw - lo

    if (this.images.length === 1 || t < 0.01) { this.draw(lo); return }

    const { canvas, ctx } = this
    const drawImg = (img, alpha) => {
      if (!img?.complete || img.naturalWidth === 0) return
      const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight)
      const sw = img.naturalWidth * scale
      const sh = img.naturalHeight * scale
      ctx.globalAlpha = alpha
      ctx.drawImage(img, (canvas.width - sw) / 2, (canvas.height - sh) / 2, sw, sh)
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawImg(this.images[lo], 1 - t)
    drawImg(this.images[hi], t)
    ctx.globalAlpha = 1
  }

  resize() {
    this.canvas.width = this.canvas.offsetWidth
    this.canvas.height = this.canvas.offsetHeight
    this.draw(this.currentIndex)
  }
}

export function useFrameSequence(framePaths, onProgress) {
  const canvasRef = useRef(null)
  const seqRef = useRef(null)

  const initSequence = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return null
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    const seq = new FrameSequence(canvas, framePaths, onProgress)
    seqRef.current = seq
    return seq
  }, [framePaths, onProgress])

  const scrub = useCallback((progress) => {
    seqRef.current?.scrub(progress)
  }, [])

  const preload = useCallback(() => {
    if (!seqRef.current) initSequence()
    return seqRef.current?.preload() || Promise.resolve()
  }, [initSequence])

  const resize = useCallback(() => {
    seqRef.current?.resize()
  }, [])

  useEffect(() => {
    initSequence()
    return () => { seqRef.current = null }
  }, [initSequence])

  return { canvasRef, scrub, preload, resize }
}
