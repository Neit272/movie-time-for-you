import React, { useState, useEffect, useRef } from "react";
import { Menu, Input, Switch } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import "../styles/Navbar.css";

const Navbar = () => {
  const [mode, setMode] = useState(Cookies.get("mode") || "movie");
  const [current, setCurrent] = useState("home");
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const searchInputRef = useRef(null);

  useEffect(() => {
    Cookies.set("mode", mode);
    const fetchCategories = () => {
      const apiUrl =
        mode === "movie"
          ? "https://phimapi.com/the-loai"
          : "https://otruyenapi.com/v1/api/the-loai";
      axios
        .get(apiUrl)
        .then((response) => {
          const items =
            mode === "movie" ? response.data : response.data.data.items;
          setCategories(items);
        })
        .catch((error) => {
          console.error("Failed to fetch categories", error);
          setCategories([]);
        });

      if (mode === "movie") {
        axios.get("https://phimapi.com/quoc-gia").then((response) => {
          if (response.data) {
            setCountries(response.data);
          }
        });
      }
    };

    fetchCategories();
  }, [mode]);

  const handleMenuClick = (e) => {
    setCurrent(e.key);
    const baseRoute = mode === "movie" ? "phim" : "truyen-tranh";

    if (e.key === "home") {
      navigate("/");
    } else if (e.key.startsWith("category-")) {
      navigate(`/${baseRoute}/the-loai/${e.key.slice(9)}`);
    } else if (e.key.startsWith("country-")) {
      navigate(`/quoc-gia/${e.key.slice(8)}`);
    } else if (e.key === "toggle") {
      if (window.location.hash === "#/") {
        window.location.reload();
      } else {
        navigate("/");
      }
    } else {
      navigate(`${e.key}`);
    }

    setSearchValue("");
  };

  const handleSearch = () => {
    if (searchValue.trim() !== "") {
      const searchRoute = mode === "movie" ? "/tim-kiem" : "/tim-kiem-truyen";
      navigate(`${searchRoute}?keyword=${searchValue}`);
      setSearchValue("");
      searchInputRef.current.blur();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const toggleMode = () => {
    const newMode = mode === "movie" ? "comic" : "movie";
    setMode(newMode);
    Cookies.set("mode", newMode);
  };

  const menuItems =
    mode === "movie"
      ? [
          { key: "home", label: "Movie Time" },
          { key: "phim-bo", label: "Phim Bộ" },
          { key: "phim-le", label: "Phim Lẻ" },
          { key: "hoat-hinh", label: "Hoạt Hình" },
          {
            key: "the-loai",
            label: "Thể Loại",
            children: categories.map((category) => ({
              key: `category-${category.slug}`,
              label: category.name,
            })),
          },
          {
            key: "quoc-gia",
            label: "Quốc Gia",
            children: countries.map((country) => ({
              key: `country-${country.slug}`,
              label: country.name,
            })),
          },
        ]
      : [
          { key: "home", label: "Comic Time" },
          { key: "dang-phat-hanh", label: "Đang Phát Hành" },
          { key: "hoan-thanh", label: "Hoàn Thành" },
          {
            key: "the-loai",
            label: "Thể Loại",
            children: categories.map((category) => ({
              key: `category-${category.slug}`,
              label: category.name,
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
          items={[
            {
              key: "toggle",
              label: (
                <Switch
                className="custom-switch"
                  checked={mode === "comic"}
                  checkedChildren="Comic"
                  unCheckedChildren="Movie"
                  onChange={toggleMode}
                />
              ),
            },
            menuItems[0],
          ]}
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
          placeholder="Search"
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
