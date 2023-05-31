import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import { MessageBox, useTitle, MotionDiv, ViewCard } from "../../components";
import managerReducer from "./state/reducer";
import { getDetails } from "./state/action";
import { Row, Col, Button } from "react-bootstrap";
import { toastOptions } from "../../utils/error";
import { clearErrors } from "../../states/actions";
import Skeleton from "react-loading-skeleton";
import EditManagerModel from "./EditManager";
import WarehouseModel from "./WarehouseModel";

const ViewManager = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // user/:id

  const [modalShow, setModalShow] = useState(false);
  const [showHouseModel, setShowHouseModel] = useState(false);
  const [{ loading, error, manager }, dispatch] = useReducer(managerReducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [token, id]);

  useEffect(() => {
    if (error) {
      toast.error(error, toastOptions);
      clearErrors(dispatch);
    }
  }, [error])

  console.log(loading);
  const title = loading
    ? "Loading..."
    : `${manager.fullname} Details`;
  useTitle(title);

  return (
    <MotionDiv initial={{ x: "100%" }}>
      {error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <ViewCard
          data={manager}
          loading={loading}
          setModalShow={setModalShow}
          keyProps={{ "Fullname": "fullname", "Email": "email", "Mobile No.": "mobile_no", "Country": "country", "City": "city" }}
        >
          <Row>
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
        </ViewCard>
      )}
      <EditManagerModel
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      <WarehouseModel
        show={showHouseModel}
        onHide={() => setShowHouseModel(false)}
      />
      <ToastContainer />
    </MotionDiv>
  );
};

export default ViewManager;
