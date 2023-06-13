export default function managerReducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
    case "FETCH_DETAILS_REQUEST":
    case "FETCH_WAREHOUSE_REQUEST":
      return { ...state, loading: true };
    case "ADD_REQUEST":
      return { ...state, loadingAdd: true };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true, success: false };

    case "FETCH_SUCCESS":
      return {
        ...state,
        managers: action.payload.users,
        managersCount: action.payload.usersCount,
        loading: false,
      };

    case "FETCH_DETAILS_SUCCESS":
      return {
        ...state,
        loading: false,
        manager: action.payload.user
      };
    case "ADD_SUCCESS":
      return { ...state, loadingAdd: false, success: true };
    case "FETCH_WAREHOUSE_SUCCESS":
      return {
        ...state,
        loading: false,
        warehouses: action.payload.warehouses
      };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false, success: true };

    case "DELETE_SUCCESS":
      const deletedmanagerId = action.payload;
      const updatedmanagers = state.managers.filter(manager => manager.id !== deletedmanagerId);
      const updatedmanagersCount = state.managersCount - 1;
      return {
        ...state,
        managers: updatedmanagers,
        managersCount: updatedmanagersCount,
        loading: false
      };

    case "FETCH_FAIL":
    case "ADD_FAIL":
    case "FETCH_DETAILS_FAIL":
    case "FETCH_WAREHOUSE_FAIL":
    case "UPDATE_FAIL":
      return { ...state, loading: false, loadingAdd: false, loadingUpdate: false, error: action.payload };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
};