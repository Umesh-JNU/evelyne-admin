import React, { useContext, useReducer, useState } from "react";
import { Store } from "../../states/store";

import { ToastContainer, toast } from "react-toastify";
import reducer from "./state/reducer";
import { create } from "./state/action";
import { useTitle, AddForm, AutocompleteSearch, TextInput } from "../../components";
import { Button, Col, Row, Table } from "react-bootstrap";
import { toastOptions } from "../../utils/error";

export default function AddOrder() {
  const { state } = useContext(Store);
  const { token } = state;

  const [{ loading, loadingAdd, error, success }, dispatch] = useReducer(reducer, {
    loading: false,
    loadingAdd: false,
    error: "",
  });

  const orderData = {
    tin_no: "",
    address: "",
    transit_company: "",
    consignee: "",
    custom_agent: "",
    DDCOM_no: "",
    quantity_decl: "",
    physical_quant: "",
    arrival_date: "",
    last_storage_date: "",
    truck_no: "",
    container_no: "",
    transporter: "",
    ref_no: "",
    desc_product: "",
    unit: "",
    comment: "",
    name_counter: "",
    counter_valid: false,
    name_manager: "",
    manager_valid: false,
    customs: "",
    client_valid: false,
    status: "in-bound",
    items: [],
    warehouse: "",
    user: ""
  }

  const orderAttr = [
    {
      type: "number",
      props: {
        type: "number",
        label: "Tin No",
        name: "tin_no",
        value: orderData.tin_no,
      }
    },
    {
      type: "text",
      props: {
        label: "Address",
        name: "address",
        value: orderData.address,
        required: true,
      }
    },
    {
      type: "text",
      props: {
        label: "Transit Company",
        name: "transit_company",
        value: orderData.transit_company,
      }
    },
    {
      type: "text",
      props: {
        label: "Consignee",
        name: "consignee",
        value: orderData.consignee,
      }
    },
    {
      type: "text",
      props: {
        label: "Custom Agent",
        name: "custom_agent",
        value: orderData.custom_agent,
      }
    },
    {
      type: "number",
      props: {
        type: "number",
        label: "DDCOM No",
        name: "DDCOM_no",
        value: orderData.DDCOM_no,
      }
    },
    {
      type: "text",
      props: {
        label: "Quantity Declaration",
        name: "quantity_decl",
        value: orderData.quantity_decl,
      }
    },
    {
      type: "text",
      props: {
        label: "Physical Quantity",
        name: "physical_quant",
        value: orderData.physical_quant,
      }
    },
    {
      type: "date",
      props: {
        type: "date",
        label: "Arrival Date",
        name: "arrival_date",
        value: orderData.arrival_date,
        required: true,
      }
    },
    {
      type: "date",
      props: {
        type: "date",
        label: "Last Storage Date",
        name: "last_storage_date",
        value: orderData.last_storage_date,
        required: true,
      }
    },
    {
      type: "text",
      props: {
        label: "Truck No",
        name: "truck_no",
        value: orderData.truck_no,
      }
    },
    {
      type: "number",
      props: {
        type: "number",
        label: "Container No",
        name: "container_no",
        value: orderData.container_no,
      }
    },
    {
      type: "text",
      props: {
        label: "Transporter",
        name: "transporter",
        value: orderData.transporter,
      }
    },
    {
      type: "number",
      props: {
        type: "number",
        label: "Ref No",
        name: "ref_no",
        value: orderData.ref_no,
      }
    },
    {
      type: "text",
      props: {
        label: "Description of Product",
        name: "desc_product",
        value: orderData.desc_product,
      }
    },
    {
      type: "text",
      props: {
        label: "Unit",
        name: "unit",
        value: orderData.unit,
      }
    },
    {
      type: "text",
      props: {
        label: "Comment",
        name: "comment",
        value: orderData.comment,
      }
    },
    {
      type: "text",
      props: {
        label: "Customs",
        name: "customs",
        value: orderData.customs,
      }
    },
    {
      type: "text",
      props: {
        label: "Name Counter",
        name: "name_counter",
        value: orderData.name_counter,
      }
    },
    {
      type: "select",
      props: {
        label: "Status",
        name: "status",
        value: orderData.status,
        placeholder: "Select Status",
        options: [{ "arrived": "Arrived" }, { "in-bound": "In-Bound" }, { "out-bound": "Out-Bound" }]
      }
    },
    {
      type: "check",
      col: 4,
      props: {
        checklabel: "Counter Validation",
        name: "counter_valid",
        value: orderData.counter_valid,
      }
    },
    {
      type: "check",
      col: 4,
      props: {
        checklabel: "Manager Approval",
        name: "manager_valid",
        value: orderData.manager_valid,
      }
    },
    {
      type: "check",
      col: 4,
      props: {
        checklabel: "Client Validation",
        name: "client_valid",
        value: orderData.client_valid,
      }
    },
  ];
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [user, setUser] = useState();
  const [warehouse, setWarehouse] = useState();
  const [info, setInfo] = useState(orderData);

  const setUserHandler = (user) => {
    setInfo({ ...info, user: user.id });
    setUser(user);
  };

  const setWarehouseHandler = (warehouse) => {
    console.log({ warehouse })
    setInfo({ ...info, warehouse: warehouse.id });
    setWarehouse(warehouse);
  };

  const itemHandler = () => {
    console.log(item, quantity, typeof quantity);
    if (!item) {
      toast.warning("Item can't be empty.", toastOptions);
      return;
    }
    if (!quantity || quantity === '0') {
      toast.warning("Quantity can't be 0.", toastOptions);
      return;
    }
    info.items.push({ name: item, quantity: parseInt(quantity) });
    setItem("");
    setQuantity("");
  };

  const resetForm = () => {
    setInfo(orderData);
    setUser();
    setWarehouse();
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!info.user) {
      toast.warning("Please select a user.", toastOptions);
      return;
    }
    if (!info.warehouse) {
      toast.warning("Please select a warehouse.", toastOptions);
      return;
    }
    if ((info.items && info.items.length === 0) || !info.items) {
      toast.warning("Please add items to create order.", toastOptions);
      return;
    }

    await create(dispatch, token, info);
    resetForm();
  };

  useTitle("Create Order");
  return (
    <AddForm
      title="Add Order"
      data={info}
      setData={setInfo}
      inputFieldProps={orderAttr}
      submitHandler={submitHandler}
      target="/admin/orders"
      successMessage="Order Created Successfully!"
      reducerProps={{ loading: loadingAdd, error, success, dispatch }}
    >
      <Row>
        <Col md={2}>Select User</Col>
        <Col md={4}>
          <AutocompleteSearch onSelect={setUserHandler} searchType="user" />
        </Col>
        <Col md={6}>{user && <div className='d-flex '>
          <div className='me-3'>
            <img src={user.avatar} alt="img" width={50} height={50} />
          </div>
          <div>
            <span style={{ fontWeight: "700" }}>{user.fullname}</span>
            <hr style={{ margin: "0px", color: "#36454F" }} />
            <span style={{ fontSize: "0.9rem" }}>{`${user.city}, ${user.country}`}</span>
            <hr style={{ margin: "0px", color: "#36454F" }} />
            <span style={{ fontSize: "0.9rem" }}>{user.email}</span>
            <hr style={{ margin: "0px", color: "#36454F" }} />
            <span style={{ fontSize: "0.9rem" }}>{user.mobile_no}</span>
            <hr style={{ margin: "0px", color: "#36454F" }} />
          </div>
        </div>}
        </Col>
        <Col md={2} className="mt-3">Select Warehouse</Col>
        <Col md={4} className="mt-3">
          <AutocompleteSearch onSelect={setWarehouseHandler} searchType="warehouse" />
        </Col>

        <Col md={6} className="mt-3">
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
      </Row>

      <h3>Add Items</h3>
      <Row>
        <Col md={5}>
          <TextInput
            value={item}
            label="Item"
            onChange={(e) => setItem(e.target.value)}
          />
        </Col>
        <Col md={5}>
          <TextInput
            label="Quantity"
            type="number"
            min={0}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </Col>
        <Col md={2}>
          <Button className="mt-4" onClick={itemHandler}>
            Add Item
          </Button>
        </Col>
      </Row>

      <Row className="mt-3">
        {info.items && info.items.length > 0 && (
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qauntity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {info.items.map(({ name, quantity }, i) => (
                <tr key={name}       >
                  <td>{name}</td>
                  <td>{quantity}</td>
                  <td>
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        const index = info.items.findIndex(
                          (i) =>
                            i.name === name &&
                            i.quantity === quantity
                        );
                        console.log({ index });
                        if (index > -1) {
                          // only splice array when item is found

                          setInfo({
                            ...info, items: [
                              ...info.items.slice(0, index),

                              // part of the array after the given item
                              ...info.items.slice(index + 1),
                            ]
                          });
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
    </AddForm>
  );
}
