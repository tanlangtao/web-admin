const defaultState = {
    inputValue: "xiedianshenmeba",
    list: []
  };
  export default (state = defaultState, action) => {
    console.log(state, action);
    if (action.type === "change_input") {
      let newState = JSON.parse(JSON.stringify(state));
      newState.inputValue = action.value;
      return newState;
    }
    if (action.type === "addData") {
      let newState = JSON.parse(JSON.stringify(state));
      newState.list.push(newState.inputValue);
      newState.inputValue = "";
      return newState;
    }
  
    return state;
  };
  