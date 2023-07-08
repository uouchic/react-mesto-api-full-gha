import headerLogo from "../images/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import React from "react";
import { Routes, Route } from "react-router-dom";

function Header(props) {

  const navigate = useNavigate();

  function signOut() {
    localStorage.removeItem("jwt");
    navigate("/sign-in");
    props.handleSignOut();
  }

  return (
    <header className="header">
      <div className="header__logo">
        <img className="header__img" src={headerLogo} alt="Логотип" />
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <div className="header__container">
              <p className="header__link">{props.userEmail}</p>
              <p className="header__link header__link_exit" onClick={signOut}>
                Выйти
              </p>
            </div>
          }
        />

        <Route
          path="/sign-in"
          element={
            <Link to="/sign-up" className="header__link">
              Регистрация
            </Link>
          }
        />

        <Route
          path="/sign-up"
          element={
            <Link to="/sign-in" className="header__link">
              Войти
            </Link>
          }
        />
      </Routes>
    </header>
  );
}

export default Header;
