import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";
import managerReducer from "./state/reducer";
import { getDetails, updateWarehouse, removeWarehouse } from "./state/action";

import { ToastContainer, toast } from "react-toastify";
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { toastOptions } from "../../utils/error";
import { AutocompleteSearch } from "../../components";
import { clearErrors } from "../../states/actions";

export default function EditUserModel(props) {
  console.log(props.show)
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams();  // manager/:id
  const { houseId } = props;

  const [{ loading, error, loadingUpdate, manager, success }, dispatch] = useReducer(managerReducer, {
    loading: true,
    loadingUpdate: false,
    error: "",
  });

  const [house, setHouse] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const resetForm = () => {
    setHouse("");
    setWarehouses([]);
  };

  const addWarehouseHandler = (v) => {
    console.log(v);
    // console.log(item, quantity, typeof quantity);
    if (!v) {
      toast.warning("Warehouse can't be empty", toastOptions);
      return;
    }

    setWarehouses([...warehouses, { name: v.name, id: parseInt(v.id) }]);
    setHouse("");
  };

  useEffect(() => {
    if (success) {
      toast.success("Manager's Warehouse Updated Succesfully.  Redirecting...", toastOptions);
      setTimeout(() => {
        props.onHide();
        window.location.reload();
      }, 2000);
    }

    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [success, id, props.show]);

  useEffect(() => {
    if (error) {
      toast.error(error, toastOptions);
      clearErrors(dispatch);
    }
  }, [error]);

  const submitHandler = async (e) => {
    e.preventDefault();

    await updateWarehouse(dispatch, token, { managerId: manager.id, warehouse: warehouses[0].id });
    resetForm();
  };

  const removeHouse = async () => {
    await removeWarehouse(dispatch, token, {managerId: manager.id});
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">Assign/Change Warehouse</Modal.Title>
      </Modal.Header>
      <Form onSubmit={submitHandler}>
        <Modal.Body>
          <Container className="small-container">

            <AutocompleteSearch onSelect={addWarehouseHandler} searchType="warehouse" />

            {house &&
              <Table responsive striped bordered hover className="mt-3">
                <thead>
                  <tr>
                    <th>Warehouse Id</th>
                    <th>Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{house.id}</td>
                    <td>{house.fullname}</td>
                    <td>
                      <Button
                        type="danger"
                        className="btn btn-danger btn-block"
                        onClick={removeHouse}
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
          <Button variant="danger" onClick={() => { props.onHide(); setWarehouses([]) }}>
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
    </Modal >
  );
}
