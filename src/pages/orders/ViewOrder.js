import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useNavigate, useParams } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import { ArrayView, CustomTable, useTitle, ViewButton, ViewCard } from "../../components";
import reducer from "./state/reducer";
import { getDetails } from "./state/action";
import EditOrderModel from "./EditOrder";
import { Col, Row, Table } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";

const keyProps = {
  "Order Id": "id", "Tin No": "tin_no", "Address": "address", "Transit Company": "transit_company", "Consignee": "consignee", "Custom Agent": "custom_agent", "DDCOM No": "DDCOM_no", "Quantity Declaration": "quantity_decl", "Physical Quantity": "physical_quant", "Arrival Date": "arrival_date", "Transhipment Date": "trans_date", "Exit Date": "exit_date", "Last Storage Date": "last_storage_date", "Truck No": "truck_no", "Container No": "container_no", "Transporter": "transporter", "Ref No": "ref_no", "Description of Product": "desc_product", "Unit": "unit", "Comment": "comment", "Name Counter": "name_counter", "Counter Validation": "counter_valid", "Manager Approval": "manager_valid", "Customs": "customs", "Client Validation": "client_valid", "Status": "status", "Created At": "createdAt", "Last Update": "updatedAt",

};
// "Items": "items", "Warehouse": "warehouse", "User": "user"


const ViewOrder = () => {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // order/:id

  const [modalShow, setModalShow] = useState(false);
  const [arrModalShow, setArrModalShow] = useState(false);
  const [{ loading, error, order, history }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [token, id]);

  const getOrderType = (type) => {
    switch (type) {
      case 'arrival': return 'Goods InBound';
      case 'partial': return 'Goods OutBound';
      case 'complete': return 'Goods Exit';
      default: return;
    }
  }
  useTitle("Order Details");
  return (
    <ViewCard
      title={"Order Details"}
      data={order}
      setModalShow={setModalShow}
      keyProps={keyProps}
      reducerProps={{ error, loading, dispatch }}
      isEdit={false}
    >
      <Row>
        <Col md={8}>
          <h4>Order Items</h4>
          {loading ? <Skeleton count={5} height={25} /> :
            order && order.items.length > 0 ? (
              <Table responsive striped bordered hover>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Item</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map(({ name, quantity }, i) => (
                    <tr key={i} className="odd">
                      <td className="text-center">{i + 1}</td>
                      <td>{name}</td>
                      <td>{quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              "Order has no products"
            )}
        </Col>
      </Row>

      <h4 className="mt-3">Users Details</h4>
      <Row>
        <Col md={2}>
          {loading
            ? <Skeleton height={50} width={50} />
            : <img
              src={order.user.avatar}
              alt=""
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
              }}
            />}
        </Col>
        <Col md={4}>
          <p className="mb-0"><strong>Name</strong></p>
          <p>{loading ? <Skeleton /> : order.user.fullname}</p>
        </Col>
      </Row>

      <h4 className="mt-3">Warehouse Details</h4>
      <Row>
        <Col md={2}>
          {loading
            ? <Skeleton height={50} width={50} />
            : <img
              src={order.warehouse.image}
              alt=""
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
              }}
            />}
        </Col>
        <Col md={4}>
          <p className="mb-0"><strong>Name</strong></p>
          <p>{loading ? <Skeleton /> : order.warehouse.name}</p>
        </Col>
      </Row>

      {history && history.length > 0 &&
        <Row>
          <Col>
            <h4>Order History</h4>
            {<Table responsive striped bordered hover>
              <tbody>
                {history.map(({ arrival_date, exit_date, id, subOrderId, orderType }) => (
                  <tr key={id} className="odd">
                    <td>{getOrderType(orderType)}</td>
                    <td>{arrival_date ? arrival_date.slice(0, 10) : exit_date.slice(0, 10)}</td>
                    <td>{id + '-' + subOrderId}</td>
                    <td>
                      <ViewButton onClick={() => navigate(`/admin/view/order/${id}`)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>}
          </Col>
        </Row>
      }

      {/* <EditOrderModel
        show={modalShow}
        onHide={() => setModalShow(false)}
      /> */}
      {
        arrModalShow && <ArrayView
          show={arrModalShow}
          onHide={() => setArrModalShow(false)}
          arr={order?.items}
          column={{ "Item": "name", "Quantity": "quantity" }}
          title="Item List"
        />
      }
      {!arrModalShow && !modalShow && <ToastContainer />}
    </ViewCard >
  );
};

export default ViewOrder;
