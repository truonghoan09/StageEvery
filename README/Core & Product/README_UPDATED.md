# 🎵 Artist Website Platform (SaaS)
## Nền tảng tạo website & EPK cho nghệ sĩ (Song ngữ VI / EN)

---

## 1. TẦM NHÌN & Ý TƯỞNG SẢN PHẨM (IDEA)

### Vấn đề thực tế
Tại Việt Nam, đa số nghệ sĩ:
- Không có website chính thức
- Phụ thuộc vào Facebook / Instagram / YouTube
- Khi gửi profile cho:
  - Bầu show
  - Brand
  - Label
→ Phải gửi rất nhiều link rời rạc

### Giải pháp
Xây dựng **nền tảng SaaS** cho phép:
- Mỗi nghệ sĩ tạo **website chính thức + EPK**
- Chỉ cần **1 link duy nhất**
- Không cần biết code
- Trả phí **subscription hàng tháng**

> 👉 Bán **giá trị sử dụng**, không bán website.

---

## 2. ĐỐI TƯỢNG NGƯỜI DÙNG

- Producer / DJ độc lập
- Ca sĩ indie / underground
- Rapper
- Band nhỏ
- Nghệ sĩ mới debut

❌ Không nhắm mainstream artist (vì đã có agency)

---

## 3. GIÁ TRỊ CỐT LÕI (USP)

- Tạo website trong 5–10 phút
- Có sẵn **EPK (Electronic Press Kit)**
- Giao diện tối giản, tập trung âm nhạc
- Localized cho thị trường Việt Nam
- Giá rẻ, dễ tiếp cận

---

## 4. YÊU CẦU SẢN PHẨM

### Ngôn ngữ (i18n)
- Song ngữ:
  - 🇻🇳 Vietnamese
  - 🇺🇸 English
- Toggle ngôn ngữ thủ công
- Nội dung artist:
  - Bio VI / Bio EN

### Giao diện (Theme)
- 2 theme:
  - Light
  - Dark
- Áp dụng cho:
  - Dashboard
  - Public artist page

---

## 5. MVP – CHỈ LÀM NHỮNG GÌ CẦN THIẾT

### Public Artist Page
- Avatar + tên nghệ sĩ
- Bio (VI / EN)
- Genre
- Nhạc (Spotify / SoundCloud embed)
- Hình ảnh
- Contact / booking link

### Artist Dashboard
- Đăng nhập bằng Google
- Chỉnh sửa profile
- Upload ảnh
- Quản lý nhạc (embed)
- Preview trang public

❌ Chưa làm ở MVP:
- Thanh toán
- Merch
- Fan account
- Analytics

---

## 6. TECH STACK (UPDATED)

### Frontend
- Vite
- React
- TypeScript
- SCSS
- React Router
- react-i18next (đa ngôn ngữ)
- Theme Context (Light / Dark)

### Backend
- Node.js
- Express
- Google OAuth 2.0 (Google Cloud)

### Database & Infrastructure
- Firebase (Realtime Database hoặc Firestore **chỉ ở mức tối thiểu**)
  - Chỉ lưu metadata (JSON)
  - Không dùng Firebase Auth
- Cloudflare R2
  - Lưu ảnh
  - Lưu audio
- Render
  - Host backend API
- Vercel
  - Host frontend (client)
- UptimeRobot
  - Monitoring backend

👉 **Lưu ý kiến trúc chi phí thấp**
- Không phụ thuộc Firestore nặng
- Media & phần lớn data đặt ở R2 (rẻ hơn)

---

## 7. KIẾN TRÚC HỆ THỐNG

Client (Vite + React – Vercel)
- Public Artist Page
- Artist Dashboard
- Google Login
- Theme & Language toggle

Backend (Node.js – Render)
- Google OAuth verification
- Artist API
- Media API (R2)

Database (Firebase – metadata)
- artists
- tracks
- pages

Storage (Cloudflare R2)
- images/
- audio/

---

## 8. DATABASE DESIGN (LOW-COST)

### artists (Firebase)
- id (Google UID)
- name
- slug
- bio_vi
- bio_en
- genre
- avatarUrl (R2)
- socials
- createdAt

### tracks
- id
- artistId
- title
- embedUrl
- order

### pages
- artistId
- theme
- language

---

## 9. FRONTEND STRUCTURE

src/
- pages/
- components/
- services/
- contexts/
- i18n/
- styles/
- types/

---

## 10. AUTH FLOW (GOOGLE AUTH ONLY)

1. User login via Google OAuth (frontend)
2. Client receives Google ID Token
3. Token sent to backend
4. Backend verifies token with Google
5. Create / update artist record
6. Return session token (JWT)

---

## 11. API (MVP)

- POST /auth/google
- GET /artist/me
- PUT /artist/me
- GET /artist/:slug
- POST /track
- DELETE /track/:id
- GET /health

---

## 12. DEPLOYMENT

### Frontend
- Build bằng Vite
- Deploy trên Vercel
- Domain: yourplatform.com

### Backend
- Deploy Node.js API trên Render
- Environment variables:
  - GOOGLE_CLIENT_ID
  - GOOGLE_CLIENT_SECRET
  - R2_ACCESS_KEY
  - R2_SECRET_KEY

### Monitoring
- UptimeRobot ping /health

---

## 13. VẬN HÀNH THỬ NGHIỆM (VALIDATION)

### Giai đoạn khảo sát
- Tìm 10–15 nghệ sĩ thật
- Hỏi:
  - Bạn có website không?
  - Bạn đang gửi profile bằng gì?
  - Bạn có sẵn sàng trả 99k/tháng cho 1 link chuyên nghiệp không?

### Giai đoạn test MVP
- Cho dùng miễn phí
- Quan sát:
  - Có tạo profile không?
  - Có gửi link cho booking / brand không?

👉 Chỉ cải tiến dựa trên **hành vi thật**

---

## 14. MONETIZATION (SAU MVP)

Free:
- Trang cơ bản
- Branding nền tảng

Basic (99k/tháng):
- Website riêng
- Media đầy đủ

Pro (199k/tháng):
- Custom domain
- EPK page

---

## 15. ROADMAP PHÁT TRIỂN

Phase 1:
- MVP
- Artist thật test

Phase 2:
- EPK auto
- Booking form

Phase 3:
- Subscription
- Thanh toán

Phase 4:
- Scale
- Brand – Artist matching

---

## 16. NGUYÊN TẮC PHÁT TRIỂN

- Ship sớm
- Đơn giản
- Tập trung artist experience
- Không over-engineer

---

## 17. TẦM NHÌN DÀI HẠN

> Không chỉ là website builder  
> mà là **hạ tầng số cho nghệ sĩ độc lập**

---

## LICENSE
MIT
