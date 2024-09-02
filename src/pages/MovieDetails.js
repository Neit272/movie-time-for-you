import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Image, Layout, Button, Pagination, Spin } from "antd";
import axios from "axios";
import HlsPlayer from "../components/HlsPlayer";
import "../styles/MovieDetails.css";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const decodeHtmlEntities = (str) => {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = str;
  return textarea.value;
};

const MovieDetails = () => {
  const { slug } = useParams();
  const [movie, setMovie] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const episodesPerPage = 22;

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`https://phimapi.com/phim/${slug}`);
        if (response.data.status) {
          const movieData = response.data.movie;
          setMovie(movieData);
          const allEpisodes = response.data.episodes.flatMap(
            (episodeGroup) => episodeGroup.server_data
          );
          setEpisodes(allEpisodes);
          if (allEpisodes.length > 0) {
            setSelectedEpisode(allEpisodes[0]);
          }
        } else {
          console.error("Failed to fetch movie details");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [slug]);

  const handleReadMore = () => {
    setShowMore(!showMore);
  };

  const handleEpisodeClick = (episode) => {
    setSelectedEpisode(episode);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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

  const indexOfLastEpisode = currentPage * episodesPerPage;
  const indexOfFirstEpisode = indexOfLastEpisode - episodesPerPage;
  const currentEpisodes = episodes.slice(
    indexOfFirstEpisode,
    indexOfLastEpisode
  );

  return (
    <Content
      style={{
        padding: "24px",
        maxWidth: "1000px",
        margin: "0 auto",
        backgroundColor: "#9e72c3",
      }}
    >
      <div style={{ display: "flex", marginBottom: "24px" }}>
        <Image
          src={movie.poster_url}
          alt={movie.name}
          style={{ width: "300px", height: "auto", marginRight: "24px" }}
        />
        <div>
          <Title level={1}>{movie.name}</Title>
          <Title level={3} type="secondary">
            {movie.origin_name}
          </Title>
          <Paragraph>
            <strong>Thể loại:</strong>{" "}
            {movie.category.map((cat) => cat.name).join(", ")}
          </Paragraph>
          <Paragraph>
            <strong>Quốc gia:</strong>{" "}
            {movie.country.map((cntry) => cntry.name).join(", ")}
          </Paragraph>
          <Paragraph>
            <strong>Năm:</strong> {movie.year}
          </Paragraph>
          <Paragraph>
            <strong>Thời lượng:</strong> {movie.time}
          </Paragraph>
        </div>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <Title level={3}>Tóm tắt</Title>
        <Paragraph>
          {showMore
            ? decodeHtmlEntities(movie.content)
            : `${decodeHtmlEntities(movie.content).substring(0, 250)}...`}
          {movie.content.length > 250 && (
            <Button
              type="link"
              onClick={handleReadMore}
              style={{ color: "#7338a0" }}
            >
              {showMore ? "Ẩn bớt" : "Đọc thêm"}
            </Button>
          )}
        </Paragraph>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <Title level={3}>Tập phim</Title>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div className="episodes-grid">
            {currentEpisodes.map((episode) => (
              <Button
                key={episode.slug}
                type={
                  selectedEpisode?.slug === episode.slug ? "primary" : "default"
                }
                onClick={() => handleEpisodeClick(episode)}
                style={{
                  backgroundColor:
                    selectedEpisode?.slug === episode.slug
                      ? "#7338a0"
                      : "#f0f0f0",
                  color:
                    selectedEpisode?.slug === episode.slug ? "#fff" : "#000",
                  margin: "5px",
                  width: "70px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {episode.name}
              </Button>
            ))}
          </div>
          {episodes.length > episodesPerPage && (
            <Pagination
              simple
              current={currentPage}
              total={episodes.length}
              pageSize={episodesPerPage}
              onChange={handlePageChange}
              className="pagination"
              showSizeChanger={false}
            />
          )}
        </div>
      </div>

      {selectedEpisode && selectedEpisode.link_m3u8 ? (
        <HlsPlayer
          src={selectedEpisode.link_m3u8}
          autoPlay={false}
          controls={true}
          style={{ width: "100%", height: "auto" }}
        />
      ) : (
        <div>No episode selected or no valid video URL available</div>
      )}
    </Content>
  );
};

export default MovieDetails;
