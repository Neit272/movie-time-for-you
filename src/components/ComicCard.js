import React from "react";
import { Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "../styles/ComicCard.css";

const ComicCard = ({ comic }) => {
  const navigate = useNavigate();

  const imgUrl = `https://img.otruyenapi.com/uploads/comics/${comic.thumb_url}`;

  const latestChapter = Array.isArray(comic.chaptersLatest)
    ? comic.chaptersLatest[0]?.chapter_name || "N/A"
    : comic.chaptersLatest?.chapter_name || "N/A";

  const chapterSlug = Array.isArray(comic.chaptersLatest)
    ? comic.chaptersLatest[0]?.chapter_name
    : comic.chaptersLatest?.chapter_name;

  const handleReadLatest = () => {
    if (chapterSlug) {
      navigate(`/truyen-tranh/${comic.slug}/chapter/${chapterSlug}`);
    } else {
      alert("No chapters available!");
    }
  };

  return (
    <div className="comic-card">
      <Link to={`/truyen-tranh/${comic.slug}`} className="comic-card-link">
        <img
          src={imgUrl}
          alt={comic.name || "No title available"}
          className="comic-thumb"
        />
        <div className="comic-info">
          <h3 className="comic-name">{comic.name || "Untitled Comic"}</h3>
          <div className="comic-categories">
            {comic.category.map((cat) => (
              <span key={cat.id}>{cat.name}</span>
            ))}
          </div>
        </div>
      </Link>
      <Button
        className="comic-card-button"
        type="primary"
        onClick={handleReadLatest}
        disabled={!chapterSlug}
      >
        Đọc chương {latestChapter}
      </Button>
    </div>
  );
};

export default ComicCard;
