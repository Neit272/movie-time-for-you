import React, { useState, useEffect, useRef } from "react";
import { Menu, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Navbar.css";

const Navbar = () => {
  const [current, setCurrent] = useState("home");
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  useEffect(() => {
    axios.get("https://phimapi.com/the-loai").then((response) => {
      if (response.data) {
        setCategories(response.data);
      }
    });

    axios.get("https://phimapi.com/quoc-gia").then((response) => {
      if (response.data) {
        setCountries(response.data);
      }
    });
  }, []);

  const handleMenuClick = (e) => {
    setCurrent(e.key);
    if (e.key === "home") {
      navigate("/");
    } else if (e.key === "phim-bo") {
      navigate("/phim-bo");
    } else if (e.key === "phim-le") {
      navigate("/phim-le");
    } else if (e.key === "hoat-hinh") {
      navigate("/hoat-hinh");
    }
    setSearchValue("");
  };

  const handleSearch = () => {
    if (searchValue.trim() !== "") {
      navigate(`/tim-kiem?keyword=${searchValue}`);
      setSearchValue("");
      searchInputRef.current.blur();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const menuItems = [
    {
      key: "home",
      label: "Movie Time",
      onClick: handleMenuClick,
    },
    {
      key: "phim-bo",
      label: "Phim Bộ",
    },
    {
      key: "phim-le",
      label: "Phim Lẻ",
    },
    {
      key: "hoat-hinh",
      label: "Hoạt Hình",
    },
    {
      key: "the-loai",
      label: "Thể Loại",
      children: categories.map((category) => ({
        key: `category-${category.slug}`,
        label: category.name,
        onClick: () => navigate(`/the-loai/${category.slug}`),
      })),
    },
    {
      key: "quoc-gia",
      label: "Quốc Gia",
      children: countries.map((country) => ({
        key: `country-${country.slug}`,
        label: country.name,
        onClick: () => navigate(`/quoc-gia/${country.slug}`),
      })),
    },
  ];

  return (
    <div className="navbar-container">
      <div className="navbar-left">
        <Menu
          onClick={handleMenuClick}
          selectedKeys={[current]}
          mode="horizontal"
          disabledOverflow={true}
          items={[menuItems[0]]}
        />
      </div>
      <div className="navbar-right">
        <Menu
          onClick={handleMenuClick}
          selectedKeys={[current]}
          mode="horizontal"
          disabledOverflow={true}
          items={menuItems.slice(1)}
        />
        <Input
          placeholder="Tìm kiếm"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyDown}
          ref={searchInputRef}
          suffix={<SearchOutlined onClick={handleSearch} />}
          style={{ width: 200, marginLeft: "10px" }}
        />
      </div>
    </div>
  );
};

export default Navbar;
