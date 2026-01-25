import './AppearancePreview.scss'
import { forwardRef, useEffect, useRef, useState } from 'react'

type PreviewDevice = 'desktop' | 'tablet' | 'mobile'

const VIEWPORTS = {
  desktop: { w: 1280, h: 800 },
  tablet:  { w: 768,  h: 1024 },
  mobile:  { w: 375,  h: 812 },
} as const

type Props = {
  slug: string
  device: PreviewDevice
}

const AppearancePreview = forwardRef<
  HTMLIFrameElement,
  Props
>(function AppearancePreview({ slug, device }, iframeRef) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('scale(1)')

  const DESKTOP = VIEWPORTS.desktop
  const viewport = VIEWPORTS[device]
  const src = `/artist/${slug}?preview=1`

  useEffect(() => {
    if (!containerRef.current) return

    const update = () => {
      const rect = containerRef.current!.getBoundingClientRect()
      const cw = rect.width
      const ch = rect.height

      /* ===============================
         1. SCALE CHUẨN CHO DESKTOP
      =============================== */
      const sDesktop = Math.min(
        cw / DESKTOP.w,
        ch / DESKTOP.h
      )

      /* ===============================
         2. HEIGHT HIỂN THỊ CHUNG
      =============================== */
      const commonHeight = DESKTOP.h * sDesktop

      containerRef.current!.style.height = `${commonHeight}px` 

      /* ===============================
         3. SCALE RIÊNG THEO DEVICE
      =============================== */
      const sDevice = commonHeight / viewport.h

      /* ===============================
         4. CANH GIỮA NGANG
      =============================== */
      const scaledWidth = viewport.w * sDevice
      const tx = (cw - scaledWidth) / 2

      setTransform(
        `translateX(${tx}px) scale(${sDevice})`
      )
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [device])

  return (
    <div
      ref={containerRef}
      className="appearance-preview-container"
    >
      <iframe
        ref={iframeRef}
        title={`Artist preview ${device}`}
        src={src}
        width={viewport.w}    // viewport THẬT
        height={viewport.h}   // viewport THẬT
        className="appearance-preview-iframe"
        style={{
          transform,
          transformOrigin: 'top left',
        }}
      />
    </div>
  )
})

export default AppearancePreview
