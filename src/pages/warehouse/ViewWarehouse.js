import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";
import { useTitle, ViewCard } from "../../components";
import reducer from "./state/reducer";
import { getDetails, removeHandler } from "./state/action";
import EditWarehouseModel from "./EditWarehouse.js";
import AddMangerModel from "./AddManagerModel";
import AddControllerModel from "./AddControllerModel";
import { Button, Col, Row } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";
import { toastOptions } from "../../utils/error";

const ViewWarehouse = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // warehouse/:id

  const [modalShow, setModalShow] = useState(false);
  const [showManager, setShowManager] = useState(false);
  const [showController, setShowController] = useState(false);
  const [{ loading, error, loadingUpdate, warehouse, success, message }, dispatch] = useReducer(reducer, {
    loading: true,
    loadingUpdate: false,
    error: "",
  });

  useEffect(() => {
    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [token, id]);

  useEffect(() => {
    if (success) {
      toast.success("Controller/Manager Removed Successfully.", toastOptions);
    }
  }, [success]);

  const removeManager = async (managerId) => {
    await removeHandler(dispatch, token, { managerId, warehouseId: id });
    warehouse.manager = null;
  }

  const removeController = async (controllerId) => {
    await removeHandler(dispatch, token, { controllerId, warehouseId: id });
    const idx = warehouse.controller.findIndex(({ id }) => {
      // console.log({ id, controllerId });
      return id === controllerId
    });
    // console.log({ idx });
    if (idx >= 0) warehouse.controller.splice(idx, 1);
    // console.log(warehouse.controller);
  }

  console.log(loading);
  const title = loading
    ? "Loading..."
    : `${warehouse.name} Details`;
  useTitle(title);

  return (
    <ViewCard
      title={warehouse && `${warehouse.name} Details`}
      data={warehouse}
      setModalShow={setModalShow}
      isImage={true}
      image_url={warehouse?.image}
      keyProps={{ "Name": "name", "Capacity": "capacity", "Filled": "filled", "Created At": "createdAt", "Last Update": "updatedAt" }}
      reducerProps={{ error, loading, dispatch }}
    >
      <Row className="mt-4">
        <h2>Manager Details</h2>
        <Col md={3}>
          <Button onClick={() => { setShowManager(true) }}>Add/Change Manager</Button>
        </Col>
      </Row>

      <div className="mt-3">
        {warehouse?.manager ?
          <Row>
            <Col md={2}><b>Manager - </b></Col>
            <Col md={2}>{warehouse.manager.fullname}</Col>
            <Col md={2}>
              <Button variant="danger" className="ms-3" disabled={loadingUpdate}
                onClick={() => removeManager(warehouse.manager.id)}
              >
                <FaTrashAlt />
              </Button>
            </Col>
          </Row>
          : "No Manager Assigned"
        }
      </div>

      <Row className="mt-4">
        <h2>Controller Details</h2>
        <Col md={3}>
          <Button onClick={() => { setShowController(true) }}>Add/Change Controller</Button>
        </Col>
      </Row>

      <div className="mt-3">
        {warehouse?.controller.length > 0
          ? warehouse.controller.map(({ id, fullname }, i) =>
            <Row className="mt-2" key={id}>
              <Col md={2} className="text-center"><b>{i + 1}. </b></Col>
              <Col md={2}>{fullname}</Col>
              <Col md={2}>
                <Button variant="danger" className="ms-3" disabled={loadingUpdate}
                  onClick={() => removeController(id)}
                >
                  <FaTrashAlt />
                </Button>
              </Col>
            </Row>
          )
          : "No Controller Assigned"
        }
      </div>

      <EditWarehouseModel
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      <AddMangerModel
        show={showManager}
        onHide={() => setShowManager(false)}
      />
      {showController && <AddControllerModel
        show={showController}
        onHide={() => setShowController(false)}
        controllerList={warehouse.controller}
      />}
      {!showController && !showManager && !modalShow && < ToastContainer />}
    </ViewCard>
  );
};

export default ViewWarehouse;
