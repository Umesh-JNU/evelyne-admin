import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";
import { SubmitButton, useTitle, ViewCard } from "../../components";
import reducer from "./state/reducer";
import { getDetails, removeWarehouse } from "./state/action";
import EditManagerModel from "./EditManager";
import WarehouseModel from "./WarehouseModel";
import { Button, Col, Row, Table } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import { toastOptions } from "../../utils/error";
import { FaTrashAlt } from "react-icons/fa";

const ViewManager = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // manager/:id

  const [modalShow, setModalShow] = useState(false);
  const [showHouseModel, setShowHouseModel] = useState(false);
  const [{ loading, error, loadingUpdate, manager, success }, dispatch] = useReducer(reducer, {
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
      (async () => {
        await getDetails(dispatch, token, id);
      })();

      toast.success("Warehouse Removed Successfully.", toastOptions);
    }
  }, [success]);


  const removeHouse = async () => {
    await removeWarehouse(dispatch, token, manager.id);
  };

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
        {loading ? <Skeleton height={35} /> : manager.warehouse ?
          <Table responsive striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>Warehouse Id</th>
                <th>Image</th>
                <th>Name</th>
                <th>Capacity</th>
                <th>Filled</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-center">{manager.warehouse.id}</td>
                <td>
                  <img
                    className="td-img"
                    src={manager.warehouse.image}
                    alt=""
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                    }}
                  />
                </td>
                <td>{manager.warehouse.name}</td>
                <td>{manager.warehouse.capacity}</td>
                <td>{manager.warehouse.filled}</td>
                <td>
                  <SubmitButton
                    variant="danger"
                    loading={loadingUpdate}
                    disabled={loadingUpdate}
                    onClick={removeHouse}
                  >
                    <FaTrashAlt />
                  </SubmitButton>
                </td>
              </tr>
            </tbody>
          </Table>
          : <p className="p-bold">No Warehouse Assigned</p>
        }
      </Row>
      <EditManagerModel
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      {showHouseModel && <WarehouseModel
        show={showHouseModel}
        onHide={() => setShowHouseModel(false)}
        house={manager?.warehouse}
        reload={async () => { await getDetails(dispatch, token, id); }}
      />}
      {!showHouseModel && !modalShow && <ToastContainer />}
    </ViewCard>
  );
};

export default ViewManager;
