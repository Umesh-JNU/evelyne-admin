import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";
import { useTitle, ViewCard } from "../../components";
import reducer from "./state/reducer";
import { getDetails, removeWarehouse } from "./state/action";
import EditControllerModel from "./EditController";
import WarehouseModel from "./WarehouseModel";
import { Button, Col, Row, Spinner, Table } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import { toastOptions } from "../../utils/error";
import { FaTrashAlt } from "react-icons/fa";

const ViewController = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // controller/:id

  const [modalShow, setModalShow] = useState(false);
  const [showHouseModel, setShowHouseModel] = useState(false);
  const [{ loading, error, loadingUpdate, controller, success }, dispatch] = useReducer(reducer, {
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


  const removeHouse = async (warehouseId) => {
    await removeWarehouse(dispatch, token, { controllerId: controller.id, warehouseId });
  };

  console.log(loading);
  const title = loading
    ? "Loading..."
    : `${controller.fullname} Details`;
  useTitle(title);

  return (
    <ViewCard
      title={controller && `${controller.fullname} Details`}
      data={controller}
      setModalShow={setModalShow}
      isImage={true}
      image_url={controller?.avatar}
      keyProps={{ "Fullname": "fullname", "Email": "email", "Mobile No.": "mobile_no", "Country": "country", "City": "city", "Created At": "createdAt", "Last Update": "updatedAt" }}
      reducerProps={{ error, loading, dispatch }}
    >
      <Row className="my-4">
        <h2>Warehouse Details</h2>
        <Col md={3}>
          <Button onClick={() => { setShowHouseModel(true) }}>Add/Change Warehouse</Button>
        </Col>
      </Row>
      <Row className="mt-3">
        {loading ? <Skeleton height={35} /> : controller.warehouses.length > 0 ?
          <Table responsive striped bordered hover>
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
              {controller.warehouses.map(({ id, name, image, capacity, filled }) => (
                <tr key={id}>
                  <td className="text-center">{id}</td>
                  <td>{name}</td>
                  <td>
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
                  </td>
                  <td>{capacity}</td>
                  <td>{filled}</td>
                  <td>
                    <Button
                      variant="danger"
                      disabled={loadingUpdate}
                      onClick={() => removeHouse(id)}
                    >
                      {loadingUpdate ? <Spinner animation="border" size="sm" /> : <FaTrashAlt />}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          : <p className="p-bold">No Warehouse Assigned</p>
        }
      </Row>

      <EditControllerModel
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      {showHouseModel && <WarehouseModel
        show={showHouseModel}
        onHide={() => setShowHouseModel(false)}
        houses={controller.warehouses}
        reload={async () => { await getDetails(dispatch, token, id); }}
      />}
      {!modalShow && !showHouseModel && <ToastContainer />}
    </ViewCard>
  );
};

export default ViewController;
