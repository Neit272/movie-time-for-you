import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { Typography, Spin, Pagination } from "antd";
import MovieCard from "../components/MovieCard";
import ComicCard from "../components/ComicCard";
import "../styles/SearchResults.css";

const { Title } = Typography;

const SearchResults = ({ title, apiUrl }) => {
  const location = useLocation();
  const { slug } = useParams();
  const [movies, setMovies] = useState([]);
  const [comics, setComics] = useState([]);
  const [pageTitle, setPageTitle] = useState(title);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const mode = Cookies.get("mode");

  useEffect(() => {
    setCurrentPage(1);
  }, [apiUrl, location, slug, title]);

  useEffect(() => {
    fetchItems(currentPage);
  }, [currentPage, apiUrl, location, slug, title]);

  const fetchItems = (page) => {
    let url = apiUrl;
    const keyword = new URLSearchParams(location.search).get("keyword");
    let currentTitle = title;

    setLoading(true);

    const isComicMode = mode === "comic";

    if (isComicMode && apiUrl) {
      url = `${apiUrl}?page=${page}`;
    } else if (apiUrl) {
      url = `${apiUrl}&page=${page}`;
    }

    if (!apiUrl) {
      if (keyword) {
        if (mode === "comic") {
          url = `https://otruyenapi.com/v1/api/tim-kiem?keyword=${keyword}`;
        } else {
          url = `https://phimapi.com/v1/api/tim-kiem?keyword=${keyword}&limit=60&page=${page}`;
        }
        currentTitle = `Kết quả tìm kiếm cho: "${keyword}"`;
        setPageTitle(currentTitle);
      } else if (location.pathname.startsWith("/phim/the-loai")) {
        url = `https://phimapi.com/v1/api/the-loai/${slug}?page=${page}&limit=60`;
      } else if (location.pathname.startsWith("/truyen-tranh/the-loai")) {
        url = `https://otruyenapi.com/v1/api/the-loai/${slug}`;
      } else if (location.pathname.startsWith("/quoc-gia")) {
        url = `https://phimapi.com/v1/api/quoc-gia/${slug}?page=${page}&limit=60`;
      }
    }

    if (url) {
      axios
        .get(url)
        .then((response) => {
          if (response.data.status === "success") {
            const { titlePage } = response.data.data;

            if (isComicMode) {
              setComics(response.data.data.items);
              setTotalItems(response.data.data.params.pagination.totalItems);
              setTotalPages(
                Math.ceil(
                  response.data.data.params.pagination.totalItems /
                    response.data.data.params.pagination.totalItemsPerPage
                )
              );
            } else {
              setMovies(response.data.data.items);
              setTotalItems(response.data.data.params.pagination.totalItems);
              setTotalPages(
                Math.ceil(
                  response.data.data.params.pagination.totalItems /
                    response.data.data.params.pagination.totalItemsPerPage
                )
              );

              if (location.pathname.startsWith("/phim/the-loai")) {
                const categoryName =
                  response.data.data.items[0]?.category?.find(
                    (cat) => cat.slug === slug
                  )?.name;
                currentTitle = `Thể loại: ${categoryName || slug}`;
              } else if (location.pathname.startsWith("/quoc-gia")) {
                const countryName = response.data.data.items[0]?.country?.find(
                  (cntry) => cntry.slug === slug
                )?.name;
                currentTitle = `Quốc gia: ${countryName || slug}`;
              }
            }

            if (location.pathname.startsWith("/truyen-tranh/the-loai")) {
              setPageTitle(`Thể loại: ${titlePage}`);
            } else {
              setPageTitle(currentTitle);
            }
          } else {
            setMovies([]);
            setComics([]);
            setTotalItems(0);
            setTotalPages(0);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setMovies([]);
          setComics([]);
          setLoading(false);
        });
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="search-results-container">
      <Title
        level={movies.length === 0 && comics.length === 0 ? 1 : 2}
        style={{
          textAlign:
            movies.length === 0 && comics.length === 0 ? "center" : "left",
          marginTop: "20px",
        }}
      >
        {movies.length === 0 && comics.length === 0
          ? "Không tìm thấy kết quả"
          : pageTitle}
      </Title>

      <div className="search-results-grid">
        {movies.length > 0 &&
          movies.map((movie) => <MovieCard key={movie._id} movie={movie} />)}
        {comics.length > 0 &&
          comics.map((comic) => <ComicCard key={comic._id} comic={comic} />)}
      </div>

      {totalPages > 1 && (
        <Pagination
          current={currentPage}
          total={totalItems}
          pageSize={mode === "movie" ? 60 : 24}
          onChange={handlePageChange}
          align="center"
          showSizeChanger={false}
          style={{ textAlign: "center", marginTop: "20px" }}
        />
      )}
    </div>
  );
};

export default SearchResults;
