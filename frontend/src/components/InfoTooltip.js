//import headerLogo from "../images/logo.svg";

function InfoTooltip(props) {
  return (
    <div
      className={
        props.isOpen
          ? `popup popup_${props.name} popup_opened`
          : `popup popup_${props.name}`
      }
    >
      <div className={`popup__container popup__container_${props.name}`}>
        <div
          className={
            props.isSuccessTooltipStatus
              ? "popap__message popap__message_successfully"
              : "popap__message popap__message_unsuccessfully"
          }
        ></div>

        <h3 className={`popup__title popup__title_${props.name}`}>
          {props.isSuccessTooltipStatus
            ? "Вы успешно зарегистрировались!"
            : "Что-то пошло не так! Попробуйте еще раз."}
        </h3>

        <button
          className={`popup__close popup__close_${props.name}`}
          type="button"
          onClick={props.onClose}
        ></button>
      </div>
    </div>
  );
}

export default InfoTooltip;
