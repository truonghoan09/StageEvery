import './AppearancePreview.scss'
import { forwardRef } from 'react'

type PreviewDevice = 'desktop' | 'tablet' | 'mobile'

const DEVICE_VIEWPORTS: Record<
  PreviewDevice,
  { width: number; height: number }
> = {
  desktop: { width: 1280, height: 800 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 812 },
}

type Props = {
  slug: string
  device: PreviewDevice
  desktopScale: number   // 🔥 GIỮ NGUYÊN – ĐÃ CHUẨN
}

const AppearancePreview = forwardRef<
  HTMLIFrameElement,
  Props
>(function AppearancePreview(
  { slug, device, desktopScale },
  iframeRef
) {
  const desktopViewport = DEVICE_VIEWPORTS.desktop
  const viewport = DEVICE_VIEWPORTS[device]

  /**
   * 🔑 LOGIC CUỐI:
   * - Desktop: dùng nguyên desktopScale
   * - Tablet / Mobile: scale thêm theo CHIỀU CAO
   */
  const extraScale =
    device === 'desktop'
      ? 1
      : desktopViewport.height / viewport.height

  const scale = desktopScale * extraScale

  const frameWidth = viewport.width * scale
  const frameHeight = desktopViewport.height * desktopScale

  const src = `/artist/${slug}?preview=1`

  return (
    <div
      className="appearance-preview-frame"
      style={{
        width: frameWidth,
        height: frameHeight,
        margin: '0 auto',
      }}
    >
      <iframe
        ref={iframeRef}
        title={`Artist preview ${device}`}
        src={src}
        width={viewport.width}
        height={viewport.height}
        style={{
          border: 'none',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      />
    </div>
   )
})

export default AppearancePreview