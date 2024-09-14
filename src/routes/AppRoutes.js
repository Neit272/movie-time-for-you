import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import MovieDetails from "../pages/MovieDetails";
import ComicDetails from "../pages/ComicDetails";
import ComicReader from "../pages/ComicReader";
import SearchResults from "../pages/SearchResults";
import Navbar from "../components/Navbar";

const AppRoutes = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Movie Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/phim/:slug" element={<MovieDetails />} />
        <Route path="/tim-kiem" element={<SearchResults />} />
        <Route
          path="/phim-bo"
          element={
            <SearchResults
              title="Phim Bộ"
              apiUrl="https://phimapi.com/v1/api/danh-sach/phim-bo?page=1&limit=60"
            />
          }
        />
        <Route
          path="/phim-le"
          element={
            <SearchResults
              title="Phim Lẻ"
              apiUrl="https://phimapi.com/v1/api/danh-sach/phim-le?page=1&limit=60"
            />
          }
        />
        <Route
          path="/hoat-hinh"
          element={
            <SearchResults
              title="Hoạt Hình"
              apiUrl="https://phimapi.com/v1/api/danh-sach/hoat-hinh?page=1&limit=60"
            />
          }
        />
        <Route path="/phim/the-loai/:slug" element={<SearchResults />} />
        <Route path="/quoc-gia/:slug" element={<SearchResults />} />

        {/* Comic Routes */}
        <Route path="/truyen-tranh/:slug" element={<ComicDetails />} />
        <Route
          path="/truyen-tranh/:slug/chapter/:chapterNumber"
          element={<ComicReader />}
        />
        <Route
          path="/truyen-tranh/the-loai/:slug"
          element={<SearchResults />}
        />
        <Route
          path="/dang-phat-hanh"
          element={
            <SearchResults
              title="Đang Phát Hành"
              apiUrl="https://otruyenapi.com/v1/api/danh-sach/dang-phat-hanh"
            />
          }
        />
        <Route
          path="/hoan-thanh"
          element={
            <SearchResults
              title="Hoàn Thành"
              apiUrl="https://otruyenapi.com/v1/api/danh-sach/hoan-thanh"
            />
          }
        />
        <Route path="/tim-kiem-truyen" element={<SearchResults />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
