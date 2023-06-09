export default function warehouseReducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
    case "FETCH_DETAILS_REQUEST":
    case "ADD_REQUEST":
    case "FETCH_ADDINFO_REQUEST":
      return { ...state, loading: true };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true, success: false };

    case "FETCH_SUCCESS":
      return {
        ...state,
        warehouses: action.payload.warehouses,
        warehousesCount: action.payload.warehousesCount,
        loading: false,
      };

    case "FETCH_DETAILS_SUCCESS":
      return {
        ...state,
        loading: false,
        warehouse: action.payload.warehouse
      };

    case "ADD_SUCCESS":
      return { ...state, loading: false, success: true };

    case "FETCH_ADDINFO_SUCCESS":
      return {
        ...state,
        loading: false,
        managers: action.payload.managers,
        controllers: action.payload.controllers
      };

    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false, success: true };

    case "DELETE_SUCCESS":
      const deletedwarehouseId = action.payload;
      const updatedwarehouses = state.warehouses.filter(warehouse => warehouse.id !== deletedwarehouseId);
      const updatedwarehousesCount = state.warehousesCount - 1;
      return {
        ...state,
        warehouses: updatedwarehouses,
        warehousesCount: updatedwarehousesCount,
        loading: false
      };

    case "FETCH_FAIL":
    case "ADD_FAIL":
    case "FETCH_DETAILS_FAIL":
    case "FETCH_ADDINFO_FAIL":
    case "UPDATE_FAIL":
      return { ...state, loading: false, loadingUpdate: false, error: action.payload };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
};