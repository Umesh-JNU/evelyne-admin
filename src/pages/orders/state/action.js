import axiosInstance from "../../../utils/axiosUtil";
import { getError } from "../../../utils/error";

export const create = async (dispatch, token, input) => {
  console.log({ input })
  try {
    dispatch({ type: 'ADD_REQUEST' });
    const { data } = await axiosInstance.post(
      "/api/admin/order", input,
      { headers: { Authorization: token } }
    );

    console.log("Order add data", data);

    setTimeout(() => {
      dispatch({ type: 'ADD_SUCCESS' });
    }, 1500);
  } catch (err) {
    dispatch({ type: "ADD_FAIL", payload: getError(err) });
  }
};

export const getAll = async (dispatch, token, curPage, resultPerPage, query) => {
  let url = `/api/admin/orders/?keyword=${query}&resultPerPage=${resultPerPage}&currentPage=${curPage}`;
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
      "Are you sure you want to delete this order?"
    ) === true
  ) {
    try {
      dispatch({ type: "FETCH_REQUEST" });
      await axiosInstance.delete(`/api/order/${id}`, {
        headers: { Authorization: token },
      });
      dispatch({ type: "DELETE_SUCCESS", payload: id });
    } catch (error) {
      dispatch({ type: "FETCH_FAIL", payload: getError(error) });
    }
  }
}

export const update = async (dispatch, token, id, orderInfo) => {
  try {
    dispatch({ type: "UPDATE_REQUEST" });

    await axiosInstance.put(`/api/admin/order/${id}`, orderInfo, {
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

    const { data } = await axiosInstance.get(`/api/admin/order/${id}`, {
      headers: { Authorization: token },
    });
    console.log("order:", data);

    dispatch({ type: "FETCH_DETAILS_SUCCESS", payload: data });
  } catch (err) {
    dispatch({ type: "FETCH_DETAILS_FAIL", payload: getError(err) });
  }
};

export const getUsers = async (dispatch, token) => {
  try {
    dispatch({ type: "FETCH_USER_REQUEST" });
    const { data } = await axiosInstance.get(
      '/api/admin/users/?role=user',
      { headers: { Authorization: token } }
    );
    console.log("users", data);

    dispatch({ type: "FETCH_USER_SUCCESS", payload: data });
  } catch (error) {
    dispatch({ type: "FETCH_USER_FAIL", payload: getError(error) });
  }
}

export const getWarehouses = async (dispatch, token) => {
  try {
    dispatch({ type: "FETCH_WAREHOUSE_REQUEST" });
    const { data } = await axiosInstance.get(
      '/api/warehouse',
      { headers: { Authorization: token } }
    );
    console.log("warehouses", data);

    dispatch({ type: "FETCH_WAREHOUSE_SUCCESS", payload: data });
  } catch (error) {
    dispatch({ type: "FETCH_WAREHOUSE_FAIL", payload: getError(error) });
  }
}

// export const delItem = async (dispatch, token, orderId, itemId) => {
//   try {
//     dispatch({ type: "DELETE_ITEM_REQUEST" });
//     const { data } = await axiosInstance.delete(
//       `/api/admin/order/${orderId}/item/${itemId}`,
//       { headers: { Authorization: token } }
//     );
//     console.log("delete item", data);

//     dispatch({ type: "DELETE_ITEM_SUCCESS" });
//   } catch (error) {
//     dispatch({ type: "DELETE_ITEM_FAIL", payload: getError(error) });
//   }
// }

// export const addItem = async (dispatch, token, orderId, items) => {
//   try {
//     dispatch({ type: "ADD_ITEM_REQUEST" });
//     const { data } = await axiosInstance.get(
//       `/api/admin/order/${orderId}/items`,
//       { items },
//       { headers: { Authorization: token } }
//     );
//     console.log("add items", data);

//     dispatch({ type: "ADD_ITEM_SUCCESS" });
//   } catch (error) {
//     dispatch({ type: "ADD_ITEM_FAIL", payload: getError(error) });
//   }
// }
