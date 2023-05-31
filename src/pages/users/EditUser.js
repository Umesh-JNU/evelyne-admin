import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useNavigate, useParams } from "react-router-dom";
import userReducer from "./state/reducer";
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
  const { id } = useParams();  // user/:id

  const [{ loading, error, loadingUpdate, user, success }, dispatch] = useReducer(userReducer, {
    loading: true,
    loadingUpdate: false,
    error: "",
  });

  const [info, setInfo] = useState({
    fullname: "",
    email: "",
    mobile_no: "",
    country: "",
    city: "",
    role: "",
  });

  const handleInput = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setInfo({
      fullname: "",
      email: "",
      mobile_no: "",
      country: "",
      city: "",
      role: "",
    });
  };

  useEffect(() => {
    if (user && user.id === parseInt(id)) {
      setInfo({
        fullname: user.fullname,
        email: user.email,
        mobile_no: user.mobile_no,
        country: user.country,
        city: user.city,
        role: user.userRole?.role,
      });
    }

    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [id, props.show]);

  useEffect(() => {
    if (success) {
      toast.success("User Updated Succesfully.  Redirecting...", toastOptions);
      setTimeout(() => {
        navigate("/admin/users");
      }, 3000);
    }

    if (error) {
      toast.error(error, toastOptions);
    }
  }, [error, success]);

  const submitHandler = async (e) => {
    e.preventDefault();

    resetForm();
    await update(dispatch, token, id, info);
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">Edit User</Modal.Title>
      </Modal.Header>
      <Form onSubmit={submitHandler}>
        <Modal.Body>
          <Container className="small-container">
            <Form.Group className="mb-3" controlId="fullname">
              <Form.Label>Fullname</Form.Label>
              <Form.Control
                value={info.fullname}
                name="fullname"
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

            <Form.Group className="mb-3" controlId="mobile_no">
              <Form.Label>Mobile No.</Form.Label>
              <Form.Control
                value={info.mobile_no}
                name="mobile_no"
                onChange={handleInput}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="country">
              <Form.Label>Country</Form.Label>
              <Form.Control
                value={info.country}
                name="country"
                onChange={handleInput}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="city">
              <Form.Label>City</Form.Label>
              <Form.Control
                value={info.city}
                name="city"
                onChange={handleInput}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="role">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={info.role}
                name="role"
                onChange={handleInput}
                aria-label="Default select example"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="controller">Controller</option>
                <option value="manager">Manager</option>
              </Form.Select>
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
