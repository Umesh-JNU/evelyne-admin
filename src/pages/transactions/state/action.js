import axiosInstance from "../../../utils/axiosUtil";
import { getError } from "../../../utils/error";

export const create = async (dispatch, token, input) => {
  try {
    dispatch({ type: 'ADD_REQUEST' });
    const { data } = await axiosInstance.post(
      "/api/admin/transaction", input,
      { headers: { Authorization: token } }
    );

    console.log("transaction add data", data);

    setTimeout(() => {
      dispatch({ type: 'ADD_SUCCESS' });
    }, 1500);
  } catch (err) {
    dispatch({ type: "ADD_FAIL", payload: getError(err) });
  }
};

export const getAll = async (dispatch, token, curPage, resultPerPage, query) => {
  let url = `/api/admin/transactions/?keyword=${query}&resultPerPage=${resultPerPage}&currentPage=${curPage}`;
  try {
    dispatch({ type: "FETCH_REQUEST" });
    const res = await axiosInstance.get(
      url,
      { headers: { Authorization: token } }
    );
    console.log(res.data);
    dispatch({ type: "FETCH_SUCCESS", payload: res.data });
  } catch (error) {
    dispatch({ type: "FETCH_FAIL", payload: getError(error) });
  }
};

export const del = async (dispatch, token, id) => {
  if (
    window.confirm(
      "Are you sure you want to delete this transaction?"
    ) === true
  ) {
    try {
      dispatch({ type: "FETCH_REQUEST" });
      await axiosInstance.delete(`/api/admin/transaction/${id}`, {
        headers: { Authorization: token },
      });
      dispatch({ type: "DELETE_SUCCESS", payload: id });
    } catch (error) {
      dispatch({ type: "FETCH_FAIL", payload: getError(error) });
    }
  }
}

export const update = async (dispatch, token, id, transactionInfo) => {
  console.log({ id, transactionInfo })
  try {
    dispatch({ type: "UPDATE_REQUEST" });

    await axiosInstance.put(`/api/admin/transaction/${id}`, transactionInfo, {
      headers: { Authorization: token },
    });

    setTimeout(() => {
      dispatch({ type: "UPDATE_SUCCESS" });
    }, 2000);
  } catch (err) {
    dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
  }
};

export const getDetails = async (dispatch, token, id) => {
  // console.log(token, id);
  try {
    dispatch({ type: "FETCH_DETAILS_REQUEST" });

    const { data } = await axiosInstance.get(`/api/admin/transaction/${id}`, {
      headers: { Authorization: token },
    });
    console.log("transaction:", data);

    dispatch({ type: "FETCH_DETAILS_SUCCESS", payload: data });
  } catch (err) {
    dispatch({ type: "FETCH_DETAILS_FAIL", payload: getError(err) });
  }
};

export const getOrders = async (dispatch, token) => {
  let url = `/api/admin/orders`;
  try {
    dispatch({ type: "FETCH_ORDER_REQUEST" });
    const res = await axiosInstance.get(
      url,
      { headers: { Authorization: token } }
    );
    console.log(res.data);
    dispatch({ type: "FETCH_ORDER_SUCCESS", payload: res.data });
  } catch (error) {
    dispatch({ type: "FETCH_ORDER_FAIL", payload: getError(error) });
  }
};
