export default function orderReducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
    case "FETCH_DETAILS_REQUEST":
    case "FETCH_WAREHOUSE_REQUEST":
    case "FETCH_USER_REQUEST":
      return { ...state, loading: true };
    case "ADD_REQUEST":
      return { ...state, loadingAdd: true };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };

    case "FETCH_SUCCESS":
      return {
        ...state,
        orders: action.payload.orders,
        ordersCount: action.payload.orderCount,
        loading: false,
      };

    case "FETCH_DETAILS_SUCCESS":
      return {
        ...state,
        loading: false,
        order: action.payload.order,
        history: action.payload.history
      };
    case "ADD_SUCCESS":
      return { ...state, loadingAdd: false, success: true };
    case "FETCH_WAREHOUSE_SUCCESS":
      return {
        ...state,
        loading: false,
        warehouses: action.payload.warehouses,
      };
    case "FETCH_USER_SUCCESS":
      return {
        ...state,
        loading: false,
        users: action.payload.users,
      };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false, success: true };

    case "DELETE_SUCCESS":
      const deletedorderId = action.payload;
      const updatedorders = state.orders.filter(order => order.id !== deletedorderId);
      const updatedordersCount = state.ordersCount - 1;
      return {
        ...state,
        orders: updatedorders,
        ordersCount: updatedordersCount,
        loading: false
      };

    case "FETCH_FAIL":
    case "ADD_FAIL":
    case "FETCH_DETAILS_FAIL":
    case "UPDATE_DETAILS_FAIL":
    case "UPDATE_FAIL":
    case "FETCH_WAREHOUSE_FAIL":
    case "FETCH_USER_FAIL":
      return { ...state, loading: false, loadingAdd: false, loadingUpdate: false, error: action.payload };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
};