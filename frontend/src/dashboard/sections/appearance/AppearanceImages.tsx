import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import './AppearanceSection.scss'

type Props = {
  avatar: File | null
  cover: File | null
  setAvatar: (file: File | null) => void
  setCover: (file: File | null) => void
}

export default function AppearanceImages({
  avatar,
  cover,
  setAvatar,
  setCover,
}: Props) {
  const { t } = useTranslation()

  const avatarPreview = useMemo(
    () => (avatar ? URL.createObjectURL(avatar) : null),
    [avatar]
  )

  const coverPreview = useMemo(
    () => (cover ? URL.createObjectURL(cover) : null),
    [cover]
  )

  function getImageSize(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
        })
      }
      img.onerror = reject
      img.src = URL.createObjectURL(file)
    })
  }

  const handleAvatarChange = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0]
  if (!file) return

  const { width, height } = await getImageSize(file)

    // avatar tối thiểu 256x256
    if (width < 256 || height < 256) {
      alert(
        `Ảnh quá nhỏ (${width}×${height}). Vui lòng chọn ảnh tối thiểu 256×256.`
      )
      return
    }

    setAvatar(file)
  }



  return (
    <div className="appearance-images">
      <h3>{t('dashboard.appearance.images')}</h3>

      <div className="appearance-block">
        {/* ===== AVATAR ===== */}
        <div className="file-row">
          <label>{t('dashboard.appearance.avatar')}</label>

          <div className="image-input">
            {avatarPreview && (
              <img
                src={avatarPreview}
                alt="Avatar preview"
                className="image-preview image-preview--avatar"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
            />

          </div>
        </div>

        {/* ===== COVER ===== */}
        <div className="file-row">
          <label>{t('dashboard.appearance.cover')}</label>

          <div className="image-input">
            {coverPreview && (
              <img
                src={coverPreview}
                alt="Cover preview"
                className="image-preview image-preview--cover"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={e =>
                setCover(e.target.files?.[0] || null)
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}
