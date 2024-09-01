import React, { useEffect, useState } from "react";
import { Typography, Carousel, Spin } from "antd";
import axios from "axios";
import MovieCard from "../components/MovieCard";
import "../styles/HomePage.css";

const { Title } = Typography;

const HomePage = () => {
  const [newMovies, setNewMovies] = useState([]);
  const [animatedMovies, setAnimatedMovies] = useState([]);
  const [koreanMovies, setKoreanMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newMoviesResponse = await axios.get(
          "https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=1"
        );
        if (newMoviesResponse.data.status) {
          setNewMovies(newMoviesResponse.data.items || []);
        } else {
          console.error("Failed to fetch new movies");
        }

        const animatedMoviesResponse = await axios.get(
          "https://phimapi.com/v1/api/danh-sach/hoat-hinh"
        );
        if (animatedMoviesResponse.data.status === "success") {
          setAnimatedMovies(animatedMoviesResponse.data.data.items || []);
        } else {
          console.error("Failed to fetch animated movies");
        }

        const koreanMoviesResponse = await axios.get(
          "https://phimapi.com/v1/api/quoc-gia/han-quoc"
        );
        if (koreanMoviesResponse.data.status === "success") {
          setKoreanMovies(koreanMoviesResponse.data.data.items || []);
        } else {
          console.error("Failed to fetch Korean movies");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderMovieCards = (movies) => {
    return movies.map((movie) => (
      <div key={movie._id} style={{ padding: "0 10px" }}>
        <MovieCard movie={movie} />
      </div>
    ));
  };

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
    <div>
      <div className="home-page-1">
        <Title
          level={2}
          style={{
            marginBottom: "16px",
            marginLeft: "20px",
            marginTop: "16px",
          }}
        >
          Phim mới cập nhật
        </Title>
      </div>
      <Carousel
        dots={false}
        slidesToShow={5}
        slidesToScroll={5}
        infinite={true}
        draggable={true}
        arrows={false}
      >
        {renderMovieCards(newMovies)}
      </Carousel>

      <div className="home-page-2">
        <Title
          level={2}
          style={{
            marginBottom: "16px",
            marginLeft: "20px",
            marginTop: "16px",
          }}
        >
          Hoạt hình
        </Title>
      </div>
      <Carousel
        dots={false}
        slidesToShow={5}
        slidesToScroll={5}
        infinite={true}
        draggable={true}
        arrows={false}
      >
        {renderMovieCards(animatedMovies)}
      </Carousel>

      <div className="home-page-3">
        <Title
          level={2}
          style={{
            marginBottom: "16px",
            marginLeft: "20px",
            marginTop: "16px",
          }}
        >
          Phim Hàn
        </Title>
      </div>
      <Carousel
        dots={false}
        slidesToShow={5}
        slidesToScroll={5}
        infinite={true}
        draggable={true}
        arrows={false}
      >
        {renderMovieCards(koreanMovies)}
      </Carousel>
    </div>
  );
};

export default HomePage;
