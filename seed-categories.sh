#!/bin/bash

# Seed test categories into the POS system

API_URL="http://localhost:3000/api/v1"

# First, login to get a token
echo "🔐 Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed. Make sure backend is running and admin user exists."
  exit 1
fi

echo "✅ Logged in!"
echo ""

# Create test categories
CATEGORIES=(
  '{"name_en":"Hot Drinks","name_ar":"المشروبات الساخنة"}'
  '{"name_en":"Cold Drinks","name_ar":"المشروبات الباردة"}'
  '{"name_en":"Appetizers","name_ar":"المقبلات"}'
  '{"name_en":"Main Courses","name_ar":"الأطباق الرئيسية"}'
  '{"name_en":"Desserts","name_ar":"الحلويات"}'
)

echo "🌱 Creating categories..."
for CATEGORY in "${CATEGORIES[@]}"; do
  RESPONSE=$(curl -s -X POST "$API_URL/categories" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "$CATEGORY")
  
  NAME=$(echo $RESPONSE | grep -o '"name_en":"[^"]*' | cut -d'"' -f4)
  if [ ! -z "$NAME" ]; then
    echo "✅ Created: $NAME"
  fi
done

echo ""
echo "✨ Categories seeded successfully!"
echo "🔄 Refresh the menu management page to see the categories."
