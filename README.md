# Zalo Clone

Zalo Clone là một ứng dụng nhắn tin và gọi điện được xây dựng để mô phỏng các tính năng chính của ứng dụng Zalo. Dự án sử dụng các công nghệ hiện đại để cung cấp trải nghiệm giao tiếp thời gian thực, bao gồm nhắn tin, gọi video, và đăng nhập bằng mã QR.

![Chat Mobile](public/assets/readme/system.png)
![Chat Mobile](public/assets/readme/jenkin.png)


![Chat Mobile](public/assets/readme/login.png)
![Chat Mobile](public/assets/readme/QR.png)
![Chat Mobile](public/assets/readme/videocall.png)
![Chat Mobile](public/assets/readme/room.png)
![Chat Mobile](public/assets/readme/home.png)
![Chat Mobile](public/assets/readme/login-app.png)
![Chat Mobile](public/assets/readme/chat-mobile.png)

## Tính năng

- **Socket**: Sử dụng WebSocket để hỗ trợ giao tiếp thời gian thực giữa client và server, đảm bảo tin nhắn và thông báo được gửi và nhận ngay lập tức.
- **Gửi tin nhắn qua Firebase**: Tích hợp Firebase Cloud Messaging (FCM) để gửi thông báo đẩy (push notifications) khi có tin nhắn mới.
- **Chat Room**: Hỗ trợ phòng chat nhóm, nơi nhiều người dùng có thể tham gia và trò chuyện cùng lúc.
- **Chat đơn**: Tính năng nhắn tin cá nhân giữa hai người dùng với giao diện thân thiện.
- **Call Video**: Tích hợp Zope để hỗ trợ gọi video chất lượng cao giữa các người dùng.
- **Đăng nhập bằng QR**: Cho phép người dùng đăng nhập nhanh chóng bằng cách quét mã QR thông qua ứng dụng di động.
- **Giao diện người dùng**: Thiết kế trực quan, dễ sử dụng, lấy cảm hứng từ Zalo.

## Công nghệ sử dụng

- **Frontend**: ReactJS, Tailwind CSS
- **Backend**: Node.js, Express.js
- **WebSocket**: Socket.IO
- **Database**: MongoDB
- **Push Notifications**: Firebase Cloud Messaging
- **Video Call**: Zope
- **Authentication**: JWT, QR Code, OAuth2
- **Hosting**: Cloud Server
- **Devops**: Jenkins, NGINX

## Hướng dẫn setup dự án

### Yêu cầu

- Node.js (v16 trở lên)
- MongoDB (local hoặc MongoDB Atlas)
- Firebase account (cho FCM)
- Trình duyệt hỗ trợ Zope (Chrome, Firefox, v.v.)

### Cài đặt

1. **Clone repository**

   ```bash
   git clone https://github.com/Quindart/zalo-meta-web
   cd zalo-meta-web
   ```

2. **Cài đặt dependencies**

   - Frontend:
     ```bash
     cd client
     npm install
     ```
   - Backend:
     ```bash
     cd server
     npm install
     ```

3. **Cấu hình môi trường**

   - Tạo file `.env` trong thư mục `server` với nội dung:
     ```
     MONGODB_URI=mongodb://localhost:27017/zalo_clone
     JWT_SECRET=your_jwt_secret
     FIREBASE_CONFIG=your_firebase_config_json
     ```
   - Tạo file `.env` trong thư mục `client` với nội dung:
     ```
     REACT_APP_API_URL=http://localhost:5000
     REACT_APP_SOCKET_URL=http://localhost:5000
     ```

4. **Khởi chạy MongoDB**

   Đảm bảo MongoDB đang chạy trên máy local hoặc sử dụng MongoDB Atlas.

5. **Cấu hình Firebase**

   - Tạo một dự án trên Firebase Console.
   - Lấy cấu hình Firebase (API Key, Project ID, v.v.) và thêm vào file `.env` của server.
   - Cấu hình FCM để gửi thông báo đẩy.

6. **Chạy ứng dụng**

   - Backend:
     ```bash
     cd server
     npm start
     ```
   - Frontend:
     ```bash
     cd client
     npm start
     ```

   Mặc định, backend chạy trên `http://localhost:5000` và frontend chạy trên `http://localhost:3000`.

7. **Kiểm tra ứng dụng**

   - Mở trình duyệt và truy cập `http://localhost:3000`.
   - Đăng ký tài khoản, đăng nhập, hoặc sử dụng tính năng quét mã QR để trải nghiệm các tính năng.

## Hướng dẫn sử dụng

1. **Đăng nhập bằng QR**:
   - Truy cập trang đăng nhập, chọn "Đăng nhập bằng QR".
   - Mở ứng dụng di động (giả lập hoặc thực tế) và quét mã QR hiển thị trên màn hình.

2. **Chat đơn**:
   - Chọn một người dùng từ danh sách bạn bè và bắt đầu nhắn tin.
   - Tin nhắn được gửi và nhận ngay lập tức qua WebSocket.

3. **Chat nhóm**:
   - Tạo một phòng chat mới hoặc tham gia phòng hiện có.
   - Mời bạn bè vào phòng để trò chuyện.

4. **Gọi video**:
   - Trong cửa sổ chat, nhấp vào biểu tượng camera để bắt đầu gọi video.
   - Đảm bảo camera và micro đã được cấp phép.

5. **Thông báo**:
   - Khi có tin nhắn mới, thông báo đẩy sẽ được gửi qua FCM nếu ứng dụng không hoạt động.

## Lưu ý

- Đảm bảo kết nối internet ổn định để các tính năng thời gian thực (WebSocket, Zope) hoạt động tốt.
- Tính năng gọi video có thể yêu cầu cấu hình bổ sung nếu triển khai trên server (ví dụ: STUN/TURN server).
- Để triển khai production, cần cấu hình HTTPS cho WebSocket và Zope.

## Đóng góp

Chúng tôi hoan nghênh mọi đóng góp! Vui lòng làm theo các bước sau:

1. Fork repository.
2. Tạo branch mới: `git checkout -b feature/your-feature`.
3. Commit thay đổi: `git commit -m "Add your feature"`.
4. Push lên branch: `git push origin feature/your-feature`.
5. Tạo Pull Request.

## Giấy phép

Dự án được cấp phép theo [MIT License](LICENSE).
