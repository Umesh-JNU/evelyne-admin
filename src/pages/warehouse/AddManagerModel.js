import React, { useContext, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";
import controllerReducer from "./state/reducer";
import { updateWarehouse } from "./state/action";

import { ToastContainer, toast } from "react-toastify";
import { Button, Container, Modal, Table } from "react-bootstrap";
import { toastOptions } from "../../utils/error";
import { AutocompleteSearch, EditForm } from "../../components";

const ManagerTable = ({ manager }) => {
  return (
    <Table responsive striped bordered hover className="mt-3">
      <thead>
        <tr>
          <th>Manager Id</th>
          {/* <th>Image</th> */}
          <th>Name</th>
          {/* <th>Action</th> */}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="text-center">{manager.id}</td>
          {/* <td><img
            className="td-img"
            src={manager.avatar}
            alt=""
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
            }}
          /></td> */}
          <td>{manager.fullname}</td>
        </tr>
      </tbody>
    </Table>
  )
}
export default function AddMangerModel(props) {
  console.log("AssignManagerModel", { props })
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams();  // warehouse/:id
  const { manager: manager_ } = props;

  const [{ loading, error, loadingUpdate, success }, dispatch] = useReducer(controllerReducer, {
    loading: true,
    loadingUpdate: false,
    error: "",
  });

  const [manager, setManager] = useState(manager_);
  const resetForm = () => {
    setManager("");
  };

  const addManager = (m) => {
    if (!m) {
      toast.warning("Manager can't be empty", toastOptions);
      return;
    }

    setManager(m);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    await updateWarehouse(dispatch, token, { managerId: manager.id, warehouse: id });
    resetForm();
  };

  return (manager_
    ? <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Assign/Change Manager</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container className="small-container">
          <p className="p-bold m-0">Already a manager is assigned. To change manager, first remove it.</p>
          <ManagerTable manager={manager_} />
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={() => { props.onHide(); }}>
          Close
        </Button>
      </Modal.Footer>
    </Modal >

    : <EditForm
      {...props}
      title="Assign/Change Manager"
      data={{}}
      setData={() => { }}
      inputFieldProps={[]}
      submitHandler={submitHandler}
      target={''}
      successMessage="Warehouse's Manager Updated Succesfully."
      reducerProps={{ loadingUpdate, error, success, dispatch }}
    >
      <AutocompleteSearch onSelect={addManager} searchType="manager" />

      {manager && <ManagerTable manager={manager} />}
      <ToastContainer />
    </EditForm>
  );
}
