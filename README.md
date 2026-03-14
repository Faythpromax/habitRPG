habitRPG
Habit Tracker + RPG stats for fun
=======

# Expo
# Sử dụng: useState, useEffect, useContext, AsyncStorage

Cách chạy app
1. Trong terminal
   npx expo start
2. Quét QR bằng app Expo Go (hoặc nhập địa chỉ Expo project)
Chú ý máy tính và điện thoại phải dùng chung 1 mạng

Các tính năng:
- CRUD habit
- Các habit sẽ tự động reset sau mỗi ngày (có nút reset ở góc dưới để thử nghiệm nhanh)
- Hoàn thành 1 habit -> tự động thêm EXP vào player
- Đủ EXP thì lên level, tự động tăng chỉ số, giới hạn EXP tăng theo level

## Install packages:
npm install
npx expo install expo-checkbox
npx expo install @react-native-async-storage/async-storage


