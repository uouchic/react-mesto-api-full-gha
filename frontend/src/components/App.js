import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import PopupWithForm from "./PopupWithForm.js";
import Register from "./Register.js";
import Login from "./Login.js";
import { Routes, Route, Navigate } from "react-router-dom";

import { useNavigate } from "react-router-dom";

import InfoTooltip from "./InfoTooltip.js";

import EditProfilePopup from "./EditProfilePopup.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import AddPlacePopup from "./AddPlacePopup.js";

import ImagePopup from "./ImagePopup.js";
import { useState, useEffect } from "react";
import api from "../utils/Api";

import { CurrentUserContext } from "../contexts/CurrentUserContext.js";

import ProtectedRouteElement from "./ProtectedRoute";

import * as auth from "../utils/auth.js";

function App() {
  const [currentUser, setСurrentUser] = useState({});

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (loggedIn) {
      api
        .getUserInfo()
        .then((userInfoApi) => {
          setСurrentUser(userInfoApi);
        })
        .catch((err) => console.log(err));
    }
  }, [loggedIn]);

  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(null);
    setIsEditProfilePopupOpen(null);
    setIsAddPlacePopupOpen(null);
    setSelectedCard({ name: "", link: "" });
    setIsInfoTooltipOpen(null);
  }

  const [selectedCard, setSelectedCard] = useState({ name: "", link: "" });

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  const [cards, setCards] = useState([]);

  useEffect(() => {
    if (loggedIn) {
      api
        .getInitialCards()
        .then((cardsApi) => {
          setCards(cardsApi);
        })
        .catch((err) => console.log(err));
    }
  }, [loggedIn]);

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i === currentUser._id);

    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => console.log(err));
  }

  function handleCardDelete(card) {
    api
      .removeCard(card._id)
      .then(() => {
        setCards(() => cards.filter((c) => c._id !== card._id));
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateUser(userInfo) {
    api
      .setUserInfo(userInfo)
      .then((userInfoApi) => {
        setСurrentUser(userInfoApi);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateAvatar(userAvatar) {
    api
      .updateAvatar(userAvatar)
      .then((userAvatarApi) => {
        setСurrentUser(userAvatarApi);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleAddPlaceSubmit(newCard) {
    api
      .addNewCard(newCard)
      .then((newCard) => {
        setCards([newCard, ...cards]);

        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  const [userEmail, setUserEmail] = useState("");

  const handleLogin = (data) => {
    setLoggedIn(true);
    setUserEmail(data);
  };

  const handleSignOut = () => {
    setLoggedIn(false);
  };

  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);

  function openInfoTooltip() {
    setIsInfoTooltipOpen(true);
  }

  const [isSuccessTooltipStatus, setIsSuccessTooltipStatus] = useState(null);

  function setTooltipStatus(bool) {
    setIsSuccessTooltipStatus(bool);
  }

  const navigate = useNavigate();

  const checkToken = () => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      auth
        .checkToken(jwt)
        .then((data) => {
          if (data) {
            setLoggedIn(true);
            navigate("/");
            handleLogin(data.email);
          } else {
            setLoggedIn(false);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <>
      <CurrentUserContext.Provider value={currentUser}>
        <div className="page">
          <Header
            loggedIn={loggedIn}
            userEmail={userEmail}
            handleSignOut={handleSignOut}
          />

          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRouteElement
                  element={Main}
                  onEditAvatar={handleEditAvatarClick}
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onCardClick={handleCardClick}
                  onCardLike={handleCardLike}
                  cards={cards}
                  onCardDelete={handleCardDelete}
                  loggedIn={loggedIn}
                />
              }
            />

            <Route
              path="/sign-up"
              element={
                <Register
                  setTooltipStatus={setTooltipStatus}
                  openInfoTooltip={openInfoTooltip}
                />
              }
            />

            <Route
              path="/*"
              element={
                loggedIn ? (
                  <Navigate to="/" replace />
                ) : (
                  <Navigate to="/sign-in" replace />
                )
              }
            />

            <Route
              path="/sign-in"
              element={
                <Login
                  handleLogin={handleLogin}
                  setTooltipStatus={setTooltipStatus}
                  openInfoTooltip={openInfoTooltip}
                />
              }
            />
          </Routes>

          <Footer />
        </div>

        <PopupWithForm name="confirm" title="Вы уверены?" />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlaceSubmit={handleAddPlaceSubmit}
        />

        <ImagePopup card={selectedCard} onClose={closeAllPopups} />

        <InfoTooltip
          name="success"
          isOpen={isInfoTooltipOpen}
          onClose={closeAllPopups}
          isSuccessTooltipStatus={isSuccessTooltipStatus}
        />
      </CurrentUserContext.Provider>
    </>
  );
}

export default App;
