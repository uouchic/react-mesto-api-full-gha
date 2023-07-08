import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import * as auth from "../utils/auth.js";

function Register(props) {
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

    auth
      .register(formValue.email, formValue.password)
      .then((data) => {
        //console.log(data);
        navigate("/sign-in");
        props.setTooltipStatus(true);
        props.openInfoTooltip();
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
        <h3 className="user-data__title">Регистрация</h3>
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
            Зарегистрироваться
          </button>
        </form>

        <Link to="/sign-in" className="user-data__link">
          Уже зарегистрированны? Войти
        </Link>
      </section>
    </main>
  );
}

export default Register;
