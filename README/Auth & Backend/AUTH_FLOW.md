# 🔐 AUTH_FLOW – Google OAuth 2.0

## Mục tiêu
Chỉ sử dụng **Google Auth (Google Cloud OAuth 2.0)**  
Không dùng Firebase Auth.

---

## Luồng đăng nhập

### Frontend
1. User click **Login with Google**
2. Google OAuth popup
3. Nhận `id_token`
4. Gửi `id_token` lên backend

### Backend
1. Verify `id_token` với Google
2. Lấy thông tin user (email, name, avatar)
3. Tạo hoặc update artist trong database
4. Generate JWT nội bộ
5. Trả JWT về client

---

## Token sử dụng
- Google ID Token (verify)
- JWT nội bộ (session)

---

## ENV
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- JWT_SECRET
