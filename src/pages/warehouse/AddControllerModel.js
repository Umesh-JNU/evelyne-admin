import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useNavigate, useParams } from "react-router-dom";
import controllerReducer from "./state/reducer";
import { updateWarehouse } from "./state/action";

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
import { AutocompleteSearch, EditForm } from "../../components";
import { clearErrors } from "../../states/actions";

export default function AddControllerModel(props) {
  console.log("controller", {props});
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams();  // warehouse/:id
  const {controllerList} = props;

  const [{ loading, error, loadingUpdate, success }, dispatch] = useReducer(controllerReducer, {
    loading: true,
    loadingUpdate: false,
    error: "",
  });

  const [cont, setCont] = useState("");
  const [controllers, setControllers] = useState(controllerList);
  const resetForm = () => {
    setCont("");
    setControllers([]);
  };

  const addControllerHandler = (controller) => {
    if (!controller) {
      toast.warning("Controller can't be empty", toastOptions);
      return;
    }

    setControllers([...controllers, { fullname: controller.fullname, id: parseInt(controller.id) }]);
    setCont("");
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    await updateWarehouse(dispatch, token, { controllers: controllers.map(({ id }) => parseInt(id)), warehouseId: parseInt(id) });
    resetForm();
  };

  return (
    <EditForm
      {...props}
      title="Assign/Change Controller"
      data={{}}
      setData={() => {}}
      inputFieldProps={[]}
      submitHandler={submitHandler}
      target={-1}
      successMessage="Warehouse's Controller Updated Succesfully."
      reducerProps={{ loadingUpdate, error, success, dispatch }}
    >
      <AutocompleteSearch onSelect={addControllerHandler} searchType="controller" />

      <Row className="mt-3">
        {controllers && controllers.length > 0 && (
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Controller Id</th>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {controllers.map(({ id, fullname }, i) => (
                <tr key={id}       >
                  <td>{id}</td>
                  <td>{fullname}</td>
                  <td>
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        const index = controllers.findIndex(
                          (i) =>
                            i.id === id &&
                            i.fullname === fullname
                        );
                        console.log({ index });
                        if (index > -1) {
                          // only splice array when item is found

                          setControllers([
                            // part of the array before the given item
                            ...controllers.slice(0, index),

                            // part of the array after the given item
                            ...controllers.slice(index + 1),
                          ]);
                        }
                      }}
                      type="danger"
                      className="btn btn-danger btn-block"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Row>
      <ToastContainer />
    </EditForm>
  );
}
