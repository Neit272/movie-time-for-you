import React, { useEffect, useState } from "react";
import { Typography, Carousel, Spin } from "antd";
import axios from "axios";
import MovieCard from "../components/MovieCard";
import ComicCard from "../components/ComicCard";
import Cookies from "js-cookie";
import "../styles/HomePage.css";

const { Title } = Typography;

const HomePage = () => {
  const [newMovies, setNewMovies] = useState([]);
  const [animatedMovies, setAnimatedMovies] = useState([]);
  const [koreanMovies, setKoreanMovies] = useState([]);
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);

  const mode = Cookies.get("mode") || "movie";

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (mode === "movie") {
          const newMoviesResponse = await axios.get(
            "https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=1"
          );
          setNewMovies(newMoviesResponse.data.items || []);

          const animatedMoviesResponse = await axios.get(
            "https://phimapi.com/v1/api/danh-sach/hoat-hinh"
          );
          setAnimatedMovies(animatedMoviesResponse.data.data.items || []);

          const koreanMoviesResponse = await axios.get(
            "https://phimapi.com/v1/api/quoc-gia/han-quoc"
          );
          setKoreanMovies(koreanMoviesResponse.data.data.items || []);
        } else if (mode === "comic") {
          const comicsResponse = await axios.get(
            "https://otruyenapi.com/v1/api/home"
          );
          setComics(comicsResponse.data.data.items || []);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [mode]);

  const renderMovieCards = (movies) => {
    return movies.map((movie) => (
      <div key={movie._id} style={{ padding: "0 10px" }}>
        <MovieCard movie={movie} />
      </div>
    ));
  };

  const renderComicCards = (comics) => {
    return comics.map((comic) => (
      <div key={comic._id} style={{ padding: "10px" }}>
        <ComicCard comic={comic} />
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
      {mode === "movie" ? (
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
      ) : (
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
              Truyện mới cập nhật
            </Title>
          </div>
          <div className="comic-list">{renderComicCards(comics)}</div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
