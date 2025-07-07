import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Spin, Image, Select } from "antd";
import axios from "axios";
import "../styles/ComicReader.css";

const ComicReader = () => {
  const { slug, chapterNumber } = useParams();
  const navigate = useNavigate();
  const [chapterImages, setChapterImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chapterList, setChapterList] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(chapterNumber);
  const { Option } = Select;

  useEffect(() => {
    const fetchChapterData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://otruyenapi.com/v1/api/truyen-tranh/${slug}`
        );
        if (response.data.status === "success") {
          const comicData = response.data.data.item;
          setChapterList(comicData.chapters[0].server_data);
        }
      } catch (error) {
        console.error("Error fetching comic details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChapterData();
  }, [slug]);

  useEffect(() => {
    if (chapterList.length > 0) {
      fetchChapterImages(currentChapter);
    }
  }, [chapterList, currentChapter]);

  const fetchChapterImages = async (chapterName) => {
    setLoading(true);
    try {
      const currentChapterData = chapterList.find(
        (chapter) => chapter.chapter_name === chapterName
      );

      if (currentChapterData) {
        const response = await axios.get(currentChapterData.chapter_api_data);
        if (response.data.status === "success") {
          const imageUrlPrefix = response.data.data.domain_cdn;
          const imageUrlPrefix2 = response.data.data.item.chapter_path;
          const images = response.data.data.item.chapter_image.map(
            (image) =>
              `${imageUrlPrefix}/${imageUrlPrefix2}/${image.image_file}`
          );

          setChapterImages(images);
        }
      }
    } catch (error) {
      console.error("Error fetching chapter images:", error);
    } finally {
      setLoading(false);
    }
  };

  const changeChapter = (newChapter) => {
    setCurrentChapter(newChapter);
    navigate(`/truyen-tranh/${slug}/chapter/${newChapter}`); // Update the URL
  };

  const getPreviousChapter = () => {
    const currentIndex = chapterList.findIndex(
      (chapter) => chapter.chapter_name === currentChapter
    );
    if (currentIndex > 0) {
      return chapterList[currentIndex - 1].chapter_name;
    }
    return null;
  };

  const getNextChapter = () => {
    const currentIndex = chapterList.findIndex(
      (chapter) => chapter.chapter_name === currentChapter
    );
    if (currentIndex < chapterList.length - 1) {
      return chapterList[currentIndex + 1].chapter_name;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="comic-reader">
      <div className="chapter-navigation">
        <Button
          type="primary"
          className="chapter-button"
          onClick={() => changeChapter(getPreviousChapter())}
          disabled={!getPreviousChapter()}
        >
          Chương trước
        </Button>

        <Select
          value={currentChapter}
          onChange={(value) => changeChapter(value)}
          className="chapter-select"
        >
          {chapterList.map((chapter) => (
            <Option
              key={chapter.chapter_name}
              value={chapter.chapter_name}
              className="chapter-option"
            >
              Chương {chapter.chapter_name}
            </Option>
          ))}
        </Select>

        <Button
          type="primary"
          className="chapter-button"
          onClick={() => changeChapter(getNextChapter())}
          disabled={!getNextChapter()}
        >
          Chương sau
        </Button>
      </div>

      <div className="chapter-images">
        {chapterImages.map((image, index) => (
          <Image
            key={index}
            src={image}
            preview={false}
            alt={`Page ${index + 1}`}
            className="comic-image"
          />
        ))}
      </div>

      <div className="chapter-navigation" style={{ marginTop: "20px" }}>
        <Button
          type="primary"
          className="chapter-button"
          onClick={() => changeChapter(getPreviousChapter())}
          disabled={!getPreviousChapter()}
        >
          Chương trước
        </Button>
        <Button
          type="primary"
          className="chapter-button"
          onClick={() => changeChapter(getNextChapter())}
          disabled={!getNextChapter()}
        >
          Chương sau
        </Button>
      </div>
    </div>
  );
};

export default ComicReader;
