import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import { useTitle, ViewCard } from "../../components";
import reducer from "./state/reducer";
import { getDetails } from "./state/action";
import EditManagerModel from "./EditManager";
import WarehouseModel from "./WarehouseModel";
import { Button, Col, Row } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";

const ViewManager = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // manager/:id

  const [modalShow, setModalShow] = useState(false);
  const [showHouseModel, setShowHouseModel] = useState(false);
  const [{ loading, error, manager }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [token, id]);

  const title = loading
    ? "Loading..."
    : `${manager.fullname} Details`;
  useTitle(title);

  return (
    <ViewCard
      title={manager && `${manager.fullname} Details`}
      data={manager}
      setModalShow={setModalShow}
      isImage={true}
      image_url={manager?.avatar}
      keyProps={{ "Fullname": "fullname", "Email": "email", "Mobile No.": "mobile_no", "Country": "country", "City": "city", "Created At": "createdAt", "Last Update": "updatedAt" }}
      reducerProps={{ error, loading, dispatch }}
    >
      <Row className="mt-4">
        <h2>Warehouse Details</h2>
        <Col md={3}>
          <Button onClick={() => { setShowHouseModel(true) }}>Add/Change Warehouse</Button>
        </Col>
      </Row>
      <Row className="mt-3">
        {manager?.warehouse &&
          <>
            <Col md={4}>
              <p className="mb-0">
                <strong>Name</strong>
              </p>
              <p>{loading ? <Skeleton /> : manager.warehouse.name}</p>
            </Col>
            <Col md={4}>
              <p className="mb-0">
                <strong>Capacity</strong>
              </p>
              <p>{loading ? <Skeleton /> : manager.warehouse.capacity}</p>
            </Col>
            <Col md={4}>
              <p className="mb-0">
                <strong>Filled</strong>
              </p>
              <p>{loading ? <Skeleton /> : manager.warehouse.filled}</p>
            </Col>
          </>
        }
      </Row>
      <EditManagerModel
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      <WarehouseModel
        show={showHouseModel}
        onHide={() => setShowHouseModel(false)}
      />
      {!showHouseModel && !modalShow && <ToastContainer />}
    </ViewCard>
  );
};

export default ViewManager;
