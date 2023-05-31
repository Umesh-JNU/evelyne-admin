import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useNavigate, useParams } from "react-router-dom";
import reducer from "./state/reducer";
import { getDetails, update } from "./state/action";

import { ToastContainer, toast } from "react-toastify";
import {
  Button,
  Container,
  Form,
  Modal,
  Spinner,
} from "react-bootstrap";
import { toastOptions } from "../../utils/error";

export default function EditUserModel(props) {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams();  // content/:id

  const [{ loading, error, loadingUpdate, content, success }, dispatch] = useReducer(reducer, {
    loading: true,
    loadingUpdate: false,
    error: "",
  });

  const [info, setInfo] = useState({
    contact_no: "",
    email: "",
    about_us: "",
  });

  const handleInput = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setInfo({
      contact_no: "",
      email: "",
      about_us: "",
    });
  };

  useEffect(() => {
    if (content && content.id === parseInt(id)) {
      console.log({ content })
      setInfo({ ...content });
    }

    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [id, props.show]);

  useEffect(() => {
    if (loadingUpdate)
      toast.success("Content Updated Succesfully. Redirecting...", toastOptions);

    if (success) {
      navigate("/admin/contents");
    }

    if (error) {
      toast.error(error, toastOptions);
    }
  }, [success, error, loadingUpdate]);

  const submitHandler = async (e) => {
    e.preventDefault();

    await update(dispatch, token, id, info);
    resetForm();
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">Edit Content</Modal.Title>
      </Modal.Header>
      <Form onSubmit={submitHandler}>
        <Modal.Body>
          <Container className="small-container">
            <Form.Group className="mb-3" controlId="contact_no">
              <Form.Label>Contact No.</Form.Label>
              <Form.Control
                value={info.contact_no}
                name="contact_no"
                onChange={handleInput}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                value={info.email}
                name="email"
                onChange={handleInput}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="about_us">
              <Form.Label>About Us</Form.Label>
              <Form.Control
                value={info.about_us}
                name="about_us"
                onChange={handleInput}
                required
              />
            </Form.Group>
            <ToastContainer />
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={props.onHide}>
            Close
          </Button>
          <Button variant="success" type="submit" disabled={loadingUpdate ? true : false}>
            {loadingUpdate ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Submit"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
