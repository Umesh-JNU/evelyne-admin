export default function transactionReducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
    case "FETCH_DETAILS_REQUEST":
    case "FETCH_ORDER_REQUEST":
      return { ...state, loading: true };
    case "ADD_REQUEST":
      return { ...state, loadingAdd: true };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true, success: false };

    case "FETCH_SUCCESS":
      return {
        ...state,
        transactions: action.payload.transactions,
        transactionsCount: action.payload.transactionsCount,
        loading: false,
      };

    case "FETCH_DETAILS_SUCCESS":
      return {
        ...state,
        loading: false,
        transaction: action.payload.transaction
      };
    case "ADD_SUCCESS":
      return { ...state, loadingAdd: false, success: true };
    case "FETCH_ORDER_SUCCESS":
      return {
        ...state,
        loading: false,
        orders: action.payload.orders,
      };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false, success: true };

    case "DELETE_SUCCESS":
      const deletedtransactionId = action.payload;
      const updatedtransactions = state.transactions.filter(transaction => transaction.id !== deletedtransactionId);
      const updatedtransactionsCount = state.transactionsCount - 1;
      return {
        ...state,
        transactions: updatedtransactions,
        transactionsCount: updatedtransactionsCount,
        loading: false
      };

    case "FETCH_FAIL":
    case "ADD_FAIL":
    case "FETCH_DETAILS_FAIL":
    case "FETCH_ORDER_FAIL":
    case "UPDATE_FAIL":
      return { ...state, loading: false, loadingAdd: false, loadingUpdate: false, error: action.payload };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
};