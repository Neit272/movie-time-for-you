import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Image, Layout, Button, List, Spin, Tag } from "antd";
import axios from "axios";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const stripHtmlTags = (str) => {
  return str.replace(/<\/?[^>]+(>|$)/g, "");
};

const ComicDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [comic, setComic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComicDetails = async () => {
      try {
        const response = await axios.get(
          `https://otruyenapi.com/v1/api/truyen-tranh/${slug}`
        );
        if (response.data.status === "success") {
          setComic(response.data.data.item);
        } else {
          console.error("Failed to fetch comic details");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching comic details:", error);
        setLoading(false);
      }
    };

    fetchComicDetails();
  }, [slug]);

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

  if (!comic) {
    return <div>Comic not found.</div>;
  }

  const imgUrl = `https://img.otruyenapi.com/uploads/comics/${comic.thumb_url}`;
  const description = stripHtmlTags(comic.content);
  const categories = comic.category || [];
  const chapters = comic.chapters?.[0]?.server_data || [];

  const firstChapter = chapters[0];
  const latestChapter = chapters[chapters.length - 1];

  const handleNavigateToReader = (chapterName) => {
    navigate(`/truyen-tranh/${slug}/chapter/${chapterName}`);
  };

  return (
    <Content
      style={{
        padding: "24px",
        maxWidth: "1000px",
        margin: "0 auto",
        backgroundColor: "#f7f7f7",
      }}
    >
      <div style={{ display: "flex", marginBottom: "24px" }}>
        <Image
          src={imgUrl}
          alt={comic.name}
          style={{ width: "300px", height: "auto", marginRight: "24px" }}
        />
        <div>
          <Title level={1}>{comic.name}</Title>
          <Paragraph>
            <strong>Thể loại:</strong>{" "}
            {categories.map((cat) => (
              <Tag key={cat.id} color="purple">
                {cat.name}
              </Tag>
            ))}
          </Paragraph>
          <Paragraph>
            <strong>Trạng thái:</strong>{" "}
            {comic.status === "ongoing" ? "Đang cập nhật" : "Hoàn thành"}
          </Paragraph>

          <Paragraph>
            <strong>Mô tả:</strong> {description}
          </Paragraph>

          <div style={{ marginTop: "16px" }}>
            {firstChapter && (
              <Button
                type="primary"
                style={{
                  marginRight: "10px",
                  backgroundColor: "#7338a0",
                  borderColor: "#7338a0",
                }}
                onClick={() =>
                  handleNavigateToReader(firstChapter.chapter_name)
                }
              >
                Đọc từ đầu
              </Button>
            )}
            {latestChapter && (
              <Button
                type="primary"
                style={{ backgroundColor: "#7338a0", borderColor: "#7338a0" }}
                onClick={() =>
                  handleNavigateToReader(latestChapter.chapter_name)
                }
              >
                Đọc chương mới nhất
              </Button>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <Title level={3}>Danh sách chương</Title>

        <div
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            paddingRight: "10px",
            border: "1px solid #ddd",
            borderRadius: "5px",
          }}
        >
          <List
            itemLayout="horizontal"
            dataSource={chapters}
            renderItem={(chapter) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <Button
                      type="link"
                      style={{
                        color: "#7338a0",
                        backgroundColor: "#f0f0f0",
                        marginLeft: "10px",
                        width: "150px",
                      }}
                      onClick={() =>
                        handleNavigateToReader(chapter.chapter_name)
                      }
                    >
                      {`Chương ${chapter.chapter_name}`}
                    </Button>
                  }
                />
              </List.Item>
            )}
            pagination={false}
          />
        </div>
      </div>
    </Content>
  );
};

export default ComicDetails;
