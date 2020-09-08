import React from "react";
import ReactDOM from "react-dom";

import "./Modal.css";
import Backdrop from "./Backdrop";

const ModalLayout = (props) => {
  const modalContent = (
    <div className={"modal"}>
      <h2 className="modal-header">ERROR</h2>
      <div className="modal-children">{props.children}</div>
    </div>
  );
  return ReactDOM.createPortal(
    modalContent,
    document.getElementById("modal-hook")
  );
};

const Modal = (props) => {
  return (
    <React.Fragment>
      {props.show && <Backdrop onClick={props.onCancel} />}
      <ModalLayout {...props} className="modal" />
    </React.Fragment>
  );
};

export default Modal;
