import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import { MessageBox, useTitle, MotionDiv, ArrayView, ViewCard } from "../../components";
import reducer from "./state/reducer";
import { getDetails } from "./state/action";
import { toastOptions } from "../../utils/error";
import { clearErrors } from "../../states/actions";
import { FaEdit } from "react-icons/fa";
import { IoMdOpen } from "react-icons/io";
import Skeleton from "react-loading-skeleton";
import EditOrderModel from "./EditOrder";
import { getDateTime } from "../../utils/function";

const keyProps = {
  "Order Id": "id", "Tin No": "tin_no", "Address": "address", "Transit Company": "transit_company", "Consignee": "consignee", "Custom Agent": "custom_agent", "DDCOM No": "DDCOM_no", "Quantity Declaration": "quantity_decl", "Physical Quantity": "physical_quant", "Arrival Date": "arrival_date", "Last Storage Date": "last_storage_date", "Truck No": "truck_no", "Container No": "container_no", "Transporter": "transporter", "Ref No": "ref_no", "Description of Product": "desc_product", "Unit": "unit", "Comment": "comment", "Name Counter": "name_counter", "Counter Validation": "counter_valid", "Name Manager": "name_manager", "Manager Approval": "manager_valid", "Customs": "customs", "Client Validation": "client_valid", "Status": "status", "Created At": "createdAt", "Last Update": "updatedAt",
  
};
// "Items": "items", "Warehouse": "warehouse", "User": "user"


const ViewOrder = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // order/:id

  const [modalShow, setModalShow] = useState(false);
  const [arrModalShow, setArrModalShow] = useState(false);
  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  
  useEffect(() => {
    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [token, id]);

  { order && console.log({ key: Object.keys(order) }) }
  useEffect(() => {
    if (error) {
      toast.error(error, toastOptions);
      clearErrors()
    }
  }, [error])

  useTitle("Order Details");
  return (
    <MotionDiv initial={{ x: "100%" }}>
      {error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <ViewCard
          title={"Order Details"}
          data={order}
          loading={loading}
          setModalShow={setModalShow}
          keyProps={keyProps}
        >

        </ViewCard>
      )}


      <EditOrderModel
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      {arrModalShow ? (
        <ArrayView
          show={arrModalShow}
          onHide={() => setArrModalShow(false)}
          arr={order.items}
          column={{ "Item": "name", "Quantity": "quantity" }}
          title="Item List"
        />
      ) : (
        <></>
      )}
      <ToastContainer />
    </MotionDiv>
  );
};

export default ViewOrder;
