import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useNavigate, useParams } from "react-router-dom";
import controllerReducer from "./state/reducer";
import { updateWarehouse } from "./state/action";

import { ToastContainer, toast } from "react-toastify";
import {
  Button,
  Container,
  Form,
  Modal,
  Spinner,
  Table,
} from "react-bootstrap";
import { toastOptions } from "../../utils/error";
import { AutocompleteSearch } from "../../components";
import { clearErrors } from "../../states/actions";

export default function AddMangerModel(props) {
  console.log(props.show)
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams();  // warehouse/:id

  const [{ loading, error, loadingUpdate, success }, dispatch] = useReducer(controllerReducer, {
    loadingUpdate: false,
    error: "",
  });

  const [manager, setManager] = useState("");
  const resetForm = () => {
    setManager("");
  };

  useEffect(() => {
    if (success) {
      toast.success("Warehouse's Manager Updated Succesfully.  Redirecting...", toastOptions);
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    }

    if (error) {
      toast.error(error, toastOptions);
      clearErrors(dispatch);
    }
  }, [success, error]);

  const submitHandler = async (e) => {
    e.preventDefault();

    resetForm();
    await updateWarehouse(dispatch, token, { managerId: manager.id, warehouse: id });
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">Assign/Change Manager</Modal.Title>
      </Modal.Header>
      <Form onSubmit={submitHandler}>
        <Modal.Body>
          <Container className="small-container">

            <AutocompleteSearch onSelect={(manager) => setManager(manager)} searchType="manager" />

            {manager &&
              <Table responsive striped bordered hover className="mt-3">
                <thead>
                  <tr>
                    <th>Manager Id</th>
                    <th>Full Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{manager.id}</td>
                    <td>{manager.fullname}</td>
                    <td>
                      <Button
                        onClick={() => setManager("")} type="danger"
                        className="btn btn-danger btn-block"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </Table>
            }
            <ToastContainer />
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => { props.onHide(); setManager("") }}>
            Close
          </Button>
          <Button variant="success" type="submit" disabled={loadingUpdate || success ? true : false}>
            {loadingUpdate ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Submit"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal >
  );
}
