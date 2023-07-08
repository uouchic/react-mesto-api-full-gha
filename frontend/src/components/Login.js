import { useState } from "react";
import * as auth from "../utils/auth.js";
import { useNavigate } from "react-router-dom";

function Login(props) {
  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  //console.log(formValue);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormValue({
      ...formValue,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    //console.log("Нажали кнопку войти");

    auth
      .authorize(formValue.email, formValue.password)
      .then((data) => {
        console.log(data.token);
        localStorage.setItem("jwt", data.token);
        props.handleLogin(formValue.email);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        props.setTooltipStatus(false);
        props.openInfoTooltip();
      });
  };

  return (
    <main className="content">
      <section className="user-data">
        <h3 className="user-data__title">Вход</h3>
        <form className="user-data__form">
          <input
            id="email"
            name="email"
            type="email"
            value={formValue.email}
            onChange={handleChange}
            className="user-data__item"
            placeholder="Email"
          ></input>

          <input
            id="password"
            name="password"
            type="password"
            value={formValue.password}
            onChange={handleChange}
            className="user-data__item"
            placeholder="Пароль"
          ></input>

          <button
            className="user-data__save"
            type="submit"
            onClick={handleSubmit}
          >
            Войти
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;
