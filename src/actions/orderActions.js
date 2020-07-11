import { CLEAR_CART, CLEAR_ORDER, } from "../types";

export const createOrder = (order) => (dispatch) => {
  // fetch("https://localhost/api/transaction/initialize", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     "Authorization": "Bearer " + process.env.REACT_APP_MARCHAND_TOKEN
  //   },
  //   body: JSON.stringify({
  //     amount: order.total,
  //     address: order.address
  //   }),
  // })
  //   .then((res) => res.json())
  //   .then((data) => {
  //     if (!data.success) {
  //       console.log(data.message)
  //       return
  //     }
  //     localStorage.clear("cartItems");
  //     dispatch({ type: CLEAR_CART });
  //     window.location.replace(data.paymentUrl)
  //   });

  localStorage.clear("cartItems");
  dispatch({ type: CLEAR_CART });
  window.location.replace('payment-success')

};
export const clearOrder = () => (dispatch) => {
  dispatch({ type: CLEAR_ORDER });
};
