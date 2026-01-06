# ☁️ R2_MEDIA_FLOW – Upload media rẻ & hiệu quả

## Mục tiêu
- Media không lưu DB
- Chỉ lưu URL
- Giảm chi phí

---

## Luồng upload

1. Client request signed URL
2. Backend tạo signed URL từ Cloudflare R2
3. Client upload trực tiếp lên R2
4. Backend lưu URL vào Firebase

---

## Folder structure R2
- images/{artistId}/
- audio/{artistId}/

---

## Lưu ý
- Giới hạn dung lượng
- Validate file type
