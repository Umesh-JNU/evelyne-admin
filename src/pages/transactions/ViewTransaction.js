import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { Form, useParams } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";
import { SelectInput, useTitle, ViewCard } from "../../components";
import reducer from "./state/reducer";
import { getDetails, update } from "./state/action";
import { toastOptions } from "../../utils/error";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";

const ViewTransaction = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // transaction/:id

  const [{ loading, loadingUpdate, error, transaction, success }, dispatch] = useReducer(reducer, {
    loading: true,
    loadingUpdate: false,
    error: "",
  });

  const [status, setStatus] = useState(transaction?.status || '');

  useEffect(() => {
    (async () => {
      await getDetails(dispatch, token, id);
    })();

    if (success) {
      toast.success("Transaction Status Updated Successfully!", toastOptions);
    }
  }, [token, id, success]);

  useEffect(() => {
    if (transaction) setStatus(transaction.status);
  }, [transaction]);

  const updateStatus = async () => {
    await update(dispatch, token, id, { status });
  };

  useTitle("Transaction Details");
  return (
    <ViewCard
      title={"Transaction Details"}
      data={{ ...transaction, orderId: transaction?.order?.id, fullname: transaction?.order?.user?.fullname }}
      keyProps={{ "Transaction Id": "id", "Amount": "amount", "Payer Name": "fullname", "OrderId": "orderId", "Payment Mode": "mode", "Created At": "createdAt", "Last Update": "updatedAt" }}
      reducerProps={{ error, loading, dispatch }}
    >
      <div className="mt-3 d-flex align-items-center">
        <p className="p-bold m-0 me-3">Statistics For</p>
        {loading ? <Skeleton /> :
          <SelectInput
            grpStyle="mb-0"
            placeholder="Select Status"
            onChange={(e) => { setStatus(e.target.value); }}
            value={status}
            options={[{ "processing": "Processing" }, { "paid": "Paid" }, { "failed": "Failed" }]}
          />}

        <Button type="submit" className="ms-3" onClick={() => updateStatus()} disabled={loadingUpdate}>
          {loadingUpdate ? (
            <Spinner animation="border" size="sm" />
          ) : (
            "Update"
          )}
        </Button>
      </div>
      <ToastContainer />
    </ViewCard>
  );
};

export default ViewTransaction;
