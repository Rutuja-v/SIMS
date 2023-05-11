const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_PROFILE":
      return { ...state, profile: action.payload };
  }
};
