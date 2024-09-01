import React from "react";
import { Card } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "../styles/MovieCard.css";

const { Meta } = Card;

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  const posterUrl = movie.poster_url.startsWith("http")
    ? movie.poster_url
    : `https://phimimg.com/${
        movie.poster_url.startsWith("/")
          ? movie.poster_url.slice(1)
          : movie.poster_url
      }`;

  const handleCardClick = () => {
    navigate(`/phim/${movie.slug}`);
  };

  return (
    <Card
      hoverable
      className="movie-card"
      style={{ width: 240, height: 360, position: "relative" }}
      cover={
        <img
          alt={movie.name}
          src={posterUrl}
          style={{ height: "270px", objectFit: "cover" }}
        />
      }
      onClick={handleCardClick}
    >
      <Meta
        title={
          <span style={{ display: "block", maxWidth: "100%" }}>
            {movie.name.length > 25
              ? movie.name.substring(0, 22) + "..."
              : movie.name}
          </span>
        }
        description={movie.origin_name}
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      />
    </Card>
  );
};

export default MovieCard;
