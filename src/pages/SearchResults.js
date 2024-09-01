import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { Row, Col, Typography, Spin, Pagination } from "antd";
import MovieCard from "../components/MovieCard";

const { Title } = Typography;

const SearchResults = ({ title, apiUrl }) => {
  const location = useLocation();
  const { slug } = useParams();
  const [movies, setMovies] = useState([]);
  const [pageTitle, setPageTitle] = useState(title);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMovies, setTotalMovies] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setCurrentPage(1);
  }, [apiUrl, location, slug, title]);

  useEffect(() => {
    fetchMovies(currentPage);
  }, [currentPage, apiUrl, location, slug, title]);

  const fetchMovies = (page) => {
    let url = apiUrl ? `${apiUrl}&page=${page}` : null;
    let currentTitle = title;
    const keyword = new URLSearchParams(location.search).get("keyword");

    setLoading(true);

    if (!apiUrl) {
      if (keyword) {
        url = `https://phimapi.com/v1/api/tim-kiem?keyword=${keyword}&limit=600&page=${page}`;
        currentTitle = `Kết quả tìm kiếm cho: "${keyword}"`;
      } else if (location.pathname.startsWith("/the-loai")) {
        url = `https://phimapi.com/v1/api/the-loai/${slug}?page=${page}&limit=60`;
        currentTitle = `Thể loại: ${slug}`;
      } else if (location.pathname.startsWith("/quoc-gia")) {
        url = `https://phimapi.com/v1/api/quoc-gia/${slug}?page=${page}&limit=60`;
        currentTitle = `Quốc gia: ${slug}`;
      }
    }

    setPageTitle(currentTitle);

    if (url) {
      axios
        .get(url)
        .then((response) => {
          if (response.data.status === "success") {
            setMovies(response.data.data.items);
            setTotalMovies(response.data.data.params.pagination.totalItems);
            setTotalPages(response.data.data.params.pagination.totalPages);

            if (location.pathname.startsWith("/the-loai")) {
              const categoryName = response.data.data.items[0]?.category?.find(
                (cat) => cat.slug === slug
              )?.name;
              setPageTitle(`Thể loại: ${categoryName || slug}`);
            } else if (location.pathname.startsWith("/quoc-gia")) {
              const countryName = response.data.data.items[0]?.country?.find(
                (cntry) => cntry.slug === slug
              )?.name;
              setPageTitle(`Quốc gia: ${countryName || slug}`);
            }
          } else {
            setMovies([]);
            setTotalMovies(0);
            setTotalPages(0);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching movie list:", error);
          setMovies([]);
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
    <div style={{ padding: "0 24px" }}>
      <Title level={2}>{pageTitle}</Title>

      {movies.length === 0 ? (
        <Title level={1} style={{ textAlign: "center", marginTop: "20px" }}>
          Không tìm thấy kết quả
        </Title>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {movies.map((movie) => (
              <Col key={movie._id} xs={24} sm={12} md={8} lg={6} xl={4}>
                <MovieCard movie={movie} />
              </Col>
            ))}
          </Row>
          {totalPages > 1 && (
            <Pagination
              current={currentPage}
              total={totalMovies}
              pageSize={60}
              onChange={handlePageChange}
              align="center"
              showSizeChanger={false}
              style={{ textAlign: "center", marginTop: "20px" }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;