const defaultState = {
  inputValue: ""
};
export default (state = defaultState, action) => {
  // console.log(state, action);
  let newState = JSON.parse(JSON.stringify(state));
  switch (action.type) {
    case "change_input":
      newState.inputValue = action.value;
      break;
    case "resetPassword":
      newState.inputValue = "";
      break;
    default:
      break;
  }
  return newState;
};
