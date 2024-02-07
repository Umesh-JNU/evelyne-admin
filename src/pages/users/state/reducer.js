export default function userReducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
    case "FETCH_DETAILS_REQUEST":
      return { ...state, loading: true };
    case "ADD_REQUEST":
      return { ...state, loadingAdd: true };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };

    case "FETCH_SUCCESS":
      return {
        ...state,
        users: action.payload.users,
        usersCount: action.payload.usersCount,
        loading: false,
      };

    case "FETCH_DETAILS_SUCCESS":
      return {
        ...state,
        loading: false,
        user: action.payload.user
      };
    case "ADD_SUCCESS":
      return { ...state, loadingAdd: false, success: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false, success: true };

    case "DELETE_SUCCESS":
      const deleteduserId = action.payload;
      // const updatedusers = state.users.filter(user => user.id !== deleteduserId);
      const updatedusers = state.users.map(user => {
        if (user.id === deleteduserId) {
          return { ...user, deletedAt: new Date().toISOString() }
        }
        return user;
      });
      // const updatedusersCount = state.usersCount - 1;
      const updatedusersCount = state.usersCount;
      return {
        ...state,
        users: updatedusers,
        usersCount: updatedusersCount,
        loading: false
      };

    case "UN_DELETE_SUCCESS":
      const userId = action.payload;
      const updatedusers_ = state.users.map(user => {
        if (user.id === userId) {
          return { ...user, deletedAt: null }
        }
        return user;
      });

      return {
        ...state,
        users: updatedusers_,
        usersCount: state.usersCount,
        loading: false
      };

    case "FETCH_FAIL":
    case "ADD_FAIL":
    case "FETCH_DETAILS_FAIL":
    case "UPDATE_FAIL":
      return { ...state, loading: false, loadingAdd: false, loadingUpdate: false, error: action.payload };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
};