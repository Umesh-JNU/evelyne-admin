import React, { useContext, useReducer, useState } from "react";
import { Store } from "../../states/store";

import { ToastContainer, toast } from "react-toastify";
import reducer from "./state/reducer";
import { create } from "./state/action";
import { useTitle, AddForm, AutocompleteSearch, RadioInput } from "../../components";
import { Col, Row } from "react-bootstrap";
import { toastOptions } from "../../utils/error";

export default function AddController() {
  const { state } = useContext(Store);
  const { token } = state;

  const [{ loading, loadingAdd, error, success, orders }, dispatch] = useReducer(reducer, {
    loading: false,
    loadingAdd: false,
    error: "",
  });

  const transactionData = {
    type: "credit",
    // orderId: "",
    // warehouseId: "",
    amount: "",
    mode: "cash",
    status: "processing",
    desc: "",
  };
  const [info, setInfo] = useState(transactionData);
  const [order, setOrder] = useState();
  const [warehouse, setWarehouse] = useState();
  const [type, setType] = useState("order");

  const attr = [
    {
      type: "radio",
      col: 4,
      topLabel: "Transaction Type",
      props: [
        {
          label: "Credit",
          inline: true,
          value: "credit",
          name: "type",
          checked: (info.type === "credit"),
        },
        {
          label: "Debit",
          inline: true,
          value: "debit",
          name: "type",
          checked: (info.type === "debit"),
        }
      ]
    },
    {
      type: "number",
      col: 6,
      props: {
        label: "Amount",
        name: "amount",
        required: true,
      }
    },
    {
      type: "text",
      col: 12,
      props: {
        label: "Description",
        name: "desc",
        required: true,
      }
    },
    {
      type: "select",
      col: 12,
      props: {
        label: "Mode",
        name: "mode",
        value: info.mode,
        placeholder: "Select Mode",
        options: [{ "cash": "Cash" }, { "card": "Card" }, { "bank": "Bank" }]
      }
    },
    {
      type: "select",
      col: 12,
      props: {
        label: "Status",
        name: "status",
        value: info.status,
        placeholder: "Select Status",
        options: [{ "paid": "Paid" }, { "processing": "Processing" }, { "failed": "Failed" }]
      }
    },
  ];

  const setOrderHandler = (order) => {
    setOrder(order);
  };

  const setWarehouseHandler = (warehouse) => {
    setWarehouse(warehouse);
  };

  const typeHandler = (e) => {
    setType(e.target.value);
    setOrder(null);
    setWarehouse(null);
  };

  const resetForm = () => {
    setInfo(transactionData);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    switch (type) {
      case 'order':
        if (!order) {
          toast.warning("Please select an order.", toastOptions);
          return;
        }
        await create(dispatch, token, { ...info, orderId: order.id });
        break;

      case 'warehouse':
        if (!warehouse) {
          toast.warning("Please select a warehouse.", toastOptions);
          return;
        }
        await create(dispatch, token, { ...info, warehouseId: warehouse.id });
        break;

      default:
        break;
    }

    resetForm();
  };

  useTitle("Create Transaction");
  return (
    <AddForm
      title="Add Transaction"
      data={info}
      setData={setInfo}
      inputFieldProps={attr}
      submitHandler={submitHandler}
      target="/admin/transactions"
      successMessage="Transaction Created Successfully!"
      reducerProps={{ loading: loadingAdd, error, success, dispatch }}
    >
      <Row>
        <p>Select Transaction Category</p>
        <Col md={3}>
          <RadioInput label="Order" name="order" value="order" checked={type === "order"} onChange={typeHandler} />
        </Col>
        <Col md={3}>
          <RadioInput label="Warehouse" name="warehouse" value="warehouse" checked={type === "warehouse"} onChange={typeHandler} />
        </Col>
      </Row>
      <Row>
        {type === "order" ?
          <>
            <Col md={2} >Select Order</Col>
            <Col md={4}>
              <AutocompleteSearch onSelect={setOrderHandler} searchType="order" />
            </Col>

            <Col md={6}>
              {order &&
                <div className='d-flex'>
                  <div className='me-3'>
                    <img src={order.user?.avatar} alt="img" width={50} height={50} />
                  </div>

                  <div>
                    <span><b>Order Id - {order.id}</b></span>
                    <hr style={{ margin: "0px", color: "#36454F" }} />
                    <span style={{ fontSize: "0.9rem" }}><b>Qty: </b>{order.items?.length}</span>
                    <hr style={{ margin: "0px", color: "#36454F" }} />
                    <span style={{ fontSize: "0.9rem" }}><b>Status: </b>{order.status}</span>
                    <hr style={{ margin: "0px", color: "#36454F" }} />
                    <span style={{ fontSize: "0.9rem" }}><b>User: </b>{order.user?.fullname}</span>
                    <hr style={{ margin: "0px", color: "#36454F" }} />
                    <span style={{ fontSize: "0.9rem" }}><b>Warehouse: </b>{order.warehouse?.name}</span>
                    <hr style={{ margin: "0px", color: "#36454F" }} />
                  </div>
                </div>
              }
            </Col>
          </> :
          <>
            <Col md={2} >Select Warehouse</Col>
            <Col md={4}>
              <AutocompleteSearch onSelect={setWarehouseHandler} searchType="warehouse" />
            </Col>

            <Col md={6}>
              {warehouse &&
                <div className='d-flex '>
                  <div className='me-3'>
                    <img src={warehouse.image} alt="img" width={50} height={50} />
                  </div>
                  <div>
                    <span style={{ fontWeight: "700" }}>{warehouse.name}</span>
                    <hr style={{ margin: "0px", color: "#36454F" }} />
                    <span style={{ fontSize: "0.9rem" }}>{warehouse.manager?.fullname}</span>
                    <hr style={{ margin: "0px", color: "#36454F" }} />
                    <span style={{ fontSize: "0.9rem" }}>{warehouse.controller?.fullname}</span>
                    <hr style={{ margin: "0px", color: "#36454F" }} />
                  </div>
                </div>
              }
            </Col>
          </>
        }
      </Row>
      <ToastContainer />
    </AddForm >
  );
}
