# 💳 BILLING_STRIPE – Subscription Monthly

## Mô hình giá đề xuất
- Free: 1 page, watermark
- Pro: 99k–149k VND / tháng
- Studio: nhiều artist / team

## Stripe Setup
- Stripe Checkout
- Monthly recurring payment
- Webhook xử lý:
  - payment_success
  - subscription_cancel

## Flow
1. User chọn plan
2. Redirect Stripe Checkout
3. Stripe webhook → backend
4. Update user plan

## Lưu ý
- Không lưu card info
- Có grace period 7 ngày
