import React, { useContext, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";
import controllerReducer from "./state/reducer";
import { updateWarehouse } from "./state/action";

import { ToastContainer, toast } from "react-toastify";
import { Button, Table } from "react-bootstrap";
import { toastOptions } from "../../utils/error";
import { AutocompleteSearch, EditForm } from "../../components";

const ContrllerTable = ({ controllers, isAction, setControllers }) => {
  return (
    <Table responsive striped bordered hover className="mt-3">
      <thead>
        <tr>
          <th>Controller Id</th>
          {/* <th>Image</th> */}
          <th>Name</th>
          {isAction && <th>Action</th>}
        </tr>
      </thead>
      <tbody>
        {controllers.map(({ id, fullname }) => (
          <tr key={id}>
            <td className="text-center">{id}</td>
            <td>{fullname}</td>
            {/* <td>
              <img
                className="td-img"
                src={image}
                alt=""
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                }}
              />
            </td> */}
            {isAction && <td>
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
            </td>}
          </tr>
        ))}
      </tbody >
    </Table >
  );
};

export default function AddControllerModel(props) {
  console.log("AssignControllerModel", { props })
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams();  // warehouse/:id
  const { controllerList } = props;

  const [{ loading, error, loadingUpdate, success }, dispatch] = useReducer(controllerReducer, {
    loading: true,
    loadingUpdate: false,
    error: "",
  });

  const [controllers, setControllers] = useState([]);
  const resetForm = () => {
    setControllers([]);
  };

  const addControllerHandler = (controller) => {
    if (!controller) {
      toast.warning("Controller can't be empty", toastOptions);
      return;
    }

    setControllers([...controllers, { fullname: controller.fullname, id: parseInt(controller.id) }]);
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
      setData={() => { }}
      inputFieldProps={[]}
      submitHandler={submitHandler}
      target={''}
      successMessage="Warehouse's Controller Updated Succesfully."
      reducerProps={{ loadingUpdate, error, success, dispatch }}
    >
      {controllerList.length > 0 &&
        <div className="mb-3">
          <p className="p-bold m-0">Assigned Controllers</p>
          <ContrllerTable controllers={controllerList} />
        </div>
      }

      <AutocompleteSearch onSelect={addControllerHandler} searchType="controller" />

      {controllers && controllers.length > 0 && <ContrllerTable controllers={controllers} isAction={true} setControllers={setControllers} />}

      <ToastContainer />
    </EditForm>
  );
}
