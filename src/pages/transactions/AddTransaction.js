import React, { useContext, useReducer, useState } from "react";
import { Store } from "../../states/store";

import { ToastContainer, toast } from "react-toastify";
import reducer from "./state/reducer";
import { create } from "./state/action";
import { useTitle, AddForm, AutocompleteSearch } from "../../components";
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
    orderId: "",
    amount: "",
    mode: "cash",
    status: "processing",
  };
  const [info, setInfo] = useState(transactionData);
  const [order, setOrder] = useState();

  const attr = [
    {
      type: "number",
      col: 12,
      props: {
        label: "Amount",
        name: "amount",
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
    setInfo({ ...info, orderId: order.id });
    setOrder(order);
  };

  const resetForm = () => {
    setInfo(transactionData);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!info.orderId) {
      toast.warning("Please select an order.", toastOptions);
      return;
    }

    await create(dispatch, token, info);
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
        <Col md={2}>Select Order</Col>
        <Col md={4}>
          <AutocompleteSearch onSelect={setOrderHandler} searchType="order" />
        </Col>

        <Col md={6} className="mt-3">
          {order &&
            <div className='d-flex '>
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
      </Row>
      <ToastContainer />
    </AddForm>
  );
}
