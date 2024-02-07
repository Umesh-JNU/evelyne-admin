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
      data={transaction}
      keyProps={{ "Transaction Id": "id", "Amount": "amount", "Payment Mode": "mode", "Created At": "createdAt", "Last Update": "updatedAt" }}
      reducerProps={{ error, loading, dispatch }}
      isEdit={false}
    >
      <Row>
        {loading
          ? <Skeleton count={3} />
          : transaction.order
            ? <>
              <h5>Order Details</h5>
              <Col md={4}>
                <p className="mb-0">
                  <strong>orderId</strong>
                </p>
                <p>{transaction.orderId}</p>
              </Col>

              <Col md={4}>
                <p className="mb-0">
                  <strong>Payer Name</strong>
                </p>
                <p>{transaction.fullname}</p>
              </Col>
            </>
            : <>
              <h5>Warehouse Details</h5>
              <Col md={4}>
                <p className="mb-0">
                  <strong>WarehouseId</strong>
                </p>
                <p>{transaction.warehouseId}</p>
              </Col>

              <Col md={4}>
                <p className="mb-0">
                  <strong>Warehouse Name</strong>
                </p>
                <p>{transaction.warehouseName}</p>
              </Col>
            </>
        }

        <h5>Comments</h5>
        {console.log(transaction?.comments, "Comments")}
        {transaction?.comments.length > 0 ? transaction.comments.map(({ comment }) => (
          <p className="m-0" key={comment}>- {comment}</p>
        )) : <p>No Comments</p>}
      </Row>
      <div className="mt-3 d-flex align-items-center">
        <p className="p-bold m-0 me-3">Transaction Status</p>
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
