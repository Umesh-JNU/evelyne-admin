import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import { MessageBox, useTitle, MotionDiv, ViewCard } from "../../components";
import userReducer from "./state/reducer";
import { getDetails } from "./state/action";
import { toastOptions } from "../../utils/error";
import { clearErrors } from "../../states/actions";
import EditUserModel from "./EditUser.js";

const ViewUser = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // user/:id

  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error, user }, dispatch] = useReducer(userReducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    (async () => {
      await getDetails(dispatch, token, id);
    })();
  }, [token, id]);

  useEffect(() => {
    if (error) {
      toast.error(error, toastOptions);
      clearErrors(dispatch);
    }
  }, [error])

  console.log(loading);
  const title = loading
    ? "Loading..."
    : `${user.fullname} Details`;
  useTitle(title);

  console.log({ user });
  return (
    <MotionDiv initial={{ x: "100%" }}>
      {error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <ViewCard
          data={{ ...user, role: user?.userRole?.role }}
          loading={loading}
          setModalShow={setModalShow}
          keyProps={{ "Fullname": "fullname", "Fullname": "fullname", "Email": "email", "Mobile No.": "mobile_no", "Country": "country", "City": "city", "Role": "role" }}
        />
      )}
      <EditUserModel
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      <ToastContainer />
    </MotionDiv>
  );
};

export default ViewUser;
