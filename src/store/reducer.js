const defaultState = {
    list: [],
    inputValue: ''
};
// eslint-disable-next-line import/no-anonymous-default-export
export default (state = defaultState, action) => {
    if (action.type === 'change_inputValue') {
        const newState = JSON.parse(JSON.stringify(state)) //deep copy
        newState.inputValue = action.inputValue;
        return newState
    }

    return state;
}
