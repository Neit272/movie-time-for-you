# Movie Time

Movie Time là một ứng dụng web giải trí tất cả trong một (All-in-One), được xây dựng để mang lại trải nghiệm xem phim và đọc truyện tranh mượt mà. Dự án kết hợp sức mạnh của React và Vite để tạo ra một không gian giải trí tối ưu.

## Tính Năng Nổi Bật

### Kho Phim

- **Streaming mượt mà:** Hỗ trợ xem phim chất lượng cao từ nguồn server ổn định.

- **Đa dạng thể loại:** Phim lẻ, Phim bộ, TV Shows và Hoạt hình.

- **Bộ lọc thông minh:** Tìm kiếm theo Quốc gia, Năm phát hành, và Thể loại.

### Truyện Tranh

- **Trình đọc tích hợp:** Hỗ trợ 2 chế độ đọc chuyên biệt:

- **Vertical Mode:** Cuộn dọc (phù hợp Webtoon).

- **Paginated Mode:** Lật trang truyền thống.

- **Cập nhật nội dung:** Hàng ngàn đầu truyện Manhwa, Manga, Manhua mới nhất từ nguồn API.

### Giao Diện Người Dùng

- **Dark Mode:** Giao diện tối màu giúp bảo vệ mắt và tăng trải nghiệm điện ảnh.

- **Responsive Design:** Tương thích tốt trên Desktop, Tablet và Mobile.

- **Đánh dấu Yêu thích:** Quản lý danh sách yêu thích thông qua LocalStorage.

---

## Công Nghệ Sử Dụng

- **Core:** React 19, TypeScript, Vite

- **Styling:** Tailwind CSS

- **Icons:** Lucide React

- **Routing:** React Router DOM

- **Data Sources:**

- Phim: API từ `phimapi.com`

- Truyện: API từ `otruyenapi.com`

---

## Cài Đặt và Chạy Local

### 1. Clone dự án

```bash

git clone https://github.com/Neit272/movie-time-for-you.git

cd movie-time-for-you

```

### 2. Cài đặt dependencies

```bash

npm install

```

### 3. Chạy dự án

```bash

npm run dev

```

Truy cập `http://localhost:3000` để sử dụng ứng dụng.

---

## Cấu Trúc Dự Án

```

movie-time-for-you/

├── components/ # Các thành phần UI tái sử dụng (Card, Player, Sidebar...)

├── pages/ # Các trang chính (Home, Details, Watch, Search...)

├── services/ # Xử lý API và LocalStorage

├── types/ # Định nghĩa TypeScript interfaces

├── index.html # Entry point

├── index.tsx # React mounting

└── App.tsx # Main routing logic

```

---

## Đóng Góp

Mọi đóng góp đều được hoan nghênh. Nếu bạn tìm thấy lỗi hoặc có ý tưởng mới, hãy mở **Issue** hoặc gửi **Pull Request**.

1. Fork dự án

2. Tạo branch tính năng (`git checkout -b feature/NewFeature`)

3. Commit thay đổi (`git commit -m 'Add some NewFeature'`)

4. Push lên branch (`git push origin feature/NewFeature`)

5. Mở Pull Request

---

**_**When there is no more us...**_**
