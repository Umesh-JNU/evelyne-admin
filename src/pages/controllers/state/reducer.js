export default function controllerReducer(state, action) {
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
        controllers: action.payload.users,
        controllersCount: action.payload.usersCount,
        loading: false,
      };

    case "FETCH_DETAILS_SUCCESS":
      return {
        ...state,
        loading: false,
        controller: action.payload.user
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
      const deletedcontrollerId = action.payload;
      const updatedcontrollers = state.controllers.map(controller => {
        if (controller.id === deletedcontrollerId) {
          return { ...controller, deletedAt: new Date().toISOString() }
        }
        return controller;
      });
      return {
        ...state,
        controllers: updatedcontrollers,
        controllersCount: state.controllersCount,
        loading: false
      };

    case "UN_DELETE_SUCCESS":
      const controllerId = action.payload;
      const updatedcontrollers_ = state.controllers.map(controller => {
        if (controller.id === controllerId) {
          return { ...controller, deletedAt: null };
        }
        return controller;
      });
      return {
        ...state,
        controllers: updatedcontrollers_,
        controllersCount: state.controllersCount,
        loading: false
      };

    case "FETCH_FAIL":
    case "ADD_FAIL":
    case "FETCH_DETAILS_FAIL":
    case "FETCH_WAREHOUSE_FAIL":
    case "UPDATE_FAIL":
      return { ...state, loading: false, loadingAdd: false, loadingUpdate: false, success: false, error: action.payload };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
};