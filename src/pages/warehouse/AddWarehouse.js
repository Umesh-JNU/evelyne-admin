import React, { useContext, useReducer, useState } from "react";
import { Store } from "../../states/store";

import { getAllISOCodes } from 'iso-country-currency';
import { ToastContainer } from "react-toastify";
import reducer from "./state/reducer";
import { create } from "./state/action";
import { useTitle, AddForm, SelectInput } from "../../components";
import { Form } from "react-bootstrap";

export default function AddWarehouse() {
  const countryList = getAllISOCodes().map(({ countryName, currency, iso, symbol }) => {
    return { [JSON.stringify({ countryName, currency, iso, symbol })]: countryName }
  });

  console.log({ countryList })
  const { state } = useContext(Store);
  const { token } = state;

  const [{ loading, error, success }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });


  const warehouseData = {
    name: "",
    capacity: 1000,
    desc: "",
    country: ""
    // image: "",
  };

  const [info, setInfo] = useState(warehouseData);
  const attr = [
    {
      type: "text",
      col: 12,
      props: {
        label: "Warehouse Name",
        placeholder: "Warehouse Name",
        name: "name",
        required: true,
      }
    },
    {
      type: "text",
      col: 12,
      props: {
        label: "Warehouse Description",
        placeholder: "Warehouse Description",
        name: "desc",
        required: true,
      }
    },
    {
      type: "number",
      col: 12,
      props: {
        type: "number",
        label: "Initial Value ($)",
        placeholder: "Warehouse Initial Value",
        name: "capacity",
        required: true,
      }
    },
    {
      type: 'select',
      col: 12,
      props: {
        placeholder: "Select Country",
        label: "Country",
        name: "country",
        options: countryList
      }
    }
  ];

  const resetForm = () => {
    setInfo(warehouseData);
  }
  console.log({ info })

  const submitHandler = async (e) => {
    e.preventDefault();

    await create(dispatch, token, {
      ...info,
      capacity: parseInt(info.capacity),
      country: JSON.parse(info.country)
    });
    resetForm();
  };

  useTitle("Add Warehouse");
  return (
    <AddForm
      title="Add Warehouse"
      data={info}
      setData={setInfo}
      inputFieldProps={attr}
      submitHandler={submitHandler}
      target={-1}
      successMessage="Warehouse Created Successfully!"
      reducerProps={{ loading, error, success, dispatch }}
    >
      {/* <Form.Group>
        <Form.Label className="mr-3">Country</Form.Label>
        <Form.Select
          aria-label="Select Country"
          aria-controls="option"
          // value={country}
          onChange={handleCountry}
        // (e) => {
        //   console.log()
        //   setInfo({ ...info, country: JSON.parse(e.target.value) })
        // }}
        >
          <option key="blankChoice" hidden value>Select Country</option>
          {getAllISOCodes().map(({ countryName, iso, currency, symbol }) => (
            <option key={countryName} value={JSON.stringify({ countryName, iso, currency, symbol })}>
              {countryName}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <SelectInput
        placeholder="Select Country"
        label="Country"
        // value={country}
        onChange={handleCountry}
        options={countryList}
      /> */}
      <ToastContainer />
    </AddForm >
  );
}
