# React + TypeScript + Vite (với Auth JWT)

Đây là một ứng dụng React SPA được xây dựng với Vite, TypeScript, TailwindCSS, React Query, và React Hook Form, triển khai hệ thống xác thực đầy đủ bằng JWT (Access Token và Refresh Token).

## Yêu cầu của bài tập

Ứng dụng này đáp ứng các yêu cầu sau:
1.  **Luồng xác thực**: Đăng nhập, Đăng xuất.
2.  **Quản lý Token**: Access Token (in-memory), Refresh Token (`localStorage`).
3.  **Axios Interceptors**: Tự động đính kèm Access Token và tự động làm mới (refresh) khi token hết hạn (lỗi 401). Tự động logout nếu refresh thất bại.
4.  **React Query**: `useMutation` (trong `useAuth`) cho login/logout, `useQuery` (trong `HomePage`) để fetch dữ liệu được bảo vệ.
5.  **React Hook Form**: Quản lý form Đăng nhập (`LoginPage`) với validation.
6.  **Protected Routes**: `HomePage` là route được bảo vệ, tự động điều hướng về `/login` nếu chưa xác thực.
7.  **UI**: Có 3 trang: `LoginPage`, `SignUpPage`, và `HomePage` (hiển thị email user).
8.  **Public Hosting**: Ứng dụng đã được deploy.
9.  **Error Handling**: Xử lý lỗi khi login, signup và refresh token.

## Public URL (Requirement 8)

Ứng dụng được deploy trên GitHub Pages tại địa chỉ:

**[https://vow130504.github.io/IA03-User-Registration-API-with-React-Frontend-frontend/](https://vow130504.github.io/IA03-User-Registration-API-with-React-Frontend-frontend/)**

(Lưu ý: Backend API cũng đã được deploy trên Render, dựa theo file `backend/render.yaml` của bạn).

## Cách chạy dự án local

### Backend
1.  `cd backend`
2.  Tạo file `.env` dựa trên `.env.example`.
3.  Thêm các biến môi trường mới vào `.env` (thay bằng key bí mật của bạn):
    ```
PORT=3000
# Comma-separated origins (add your real frontend URL below)
FRONTEND_ORIGIN=http://localhost:5173,https://vow130504.github.io
MONGODB_URI=mongodb+srv://minhthienqbatri28_db_user:m1wZkk5HaurbtJ63@cluster0.unq1zxf.mongodb.net/user_registration_db?retryWrites=true&w=majority&appName=Cluster0
SALT_ROUNDS=10
JWT_ACCESS_SECRET=chuoi_bi_mat_so_1_rat_dai_va_phuc_tap_asdfqwer1234
JWT_REFRESH_SECRET=chuoi_bi_mat_so_2_cung_phai_khac_chuoi_1_zxcv9876
    ```
4.  `npm install`
5.  `npm run start:dev`

### Frontend
1.  `cd frontend`
2.  Tạo file `.env` (hoặc `.env.development.local`)
3.  Thêm biến môi trường trỏ đến backend API của bạn:
    ```
    VITE_API_BASE=http://localhost:3000
    ```
4.  `npm install`
5.  `npm run dev`