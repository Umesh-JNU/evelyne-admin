import axiosInstance from "../../../utils/axiosUtil";
import { getError } from "../../../utils/error";

export const create = async (dispatch, token, input) => {
  console.log({ input })
  try {
    dispatch({ type: 'ADD_REQUEST' });
    const { data } = await axiosInstance.post(
      "/api/admin/warehouse", input,
      { headers: { Authorization: token } }
    );

    console.log("warehouse add data", data);

    setTimeout(() => {
      dispatch({ type: 'ADD_SUCCESS' });
    }, 3000);
  } catch (err) {
    dispatch({ type: "ADD_FAIL", payload: getError(err) });
  }
};

export const getAll = async (dispatch, token, curPage, resultPerPage, query) => {
  try {
    dispatch({ type: "FETCH_REQUEST" });
    const res = await axiosInstance.get(
      `/api/warehouse/?keyword=${query}&resultPerPage=${resultPerPage}&currentPage=${curPage}`,
      {
        headers: { Authorization: token },
      }
    );
    console.log('all warehouse', res.data);
    dispatch({ type: "FETCH_SUCCESS", payload: res.data });
  } catch (error) {
    dispatch({ type: "FETCH_FAIL", payload: getError(error) });
  }
};

export const del = async (dispatch, token, id) => {
  if (
    window.confirm(
      "Are you sure you want to delete this warehouse?"
    ) === true
  ) {
    try {
      dispatch({ type: "FETCH_REQUEST" });
      await axiosInstance.delete(`/api/admin/warehouse/${id}`, {
        headers: { Authorization: token },
      });
      dispatch({ type: "DELETE_SUCCESS", payload: id });
    } catch (error) {
      dispatch({ type: "FETCH_FAIL", payload: getError(error) });
    }
  }
}

export const update = async (dispatch, token, id, input) => {
  try {
    dispatch({ type: "UPDATE_REQUEST" });

    await axiosInstance.put(`/api/admin/warehouse/${id}`, input, {
      headers: { Authorization: token },
    });

    setTimeout(() => {
      dispatch({ type: "UPDATE_SUCCESS" });
    }, 3000);
  } catch (err) {
    dispatch({ type: "UPDATE_FAIL" });
  }
};

export const getDetails = async (dispatch, token, id) => {
  // console.log(token, id);
  try {
    dispatch({ type: "FETCH_DETAILS_REQUEST" });

    const { data } = await axiosInstance.get(`/api/warehouse/${id}`, {
      headers: { Authorization: token },
    });
    console.log("warehouse:", data);

    dispatch({ type: "FETCH_DETAILS_SUCCESS", payload: data });
  } catch (err) {
    dispatch({
      type: "FETCH_DETAILS_FAIL",
      payload: getError(err),
    });
  }
};
