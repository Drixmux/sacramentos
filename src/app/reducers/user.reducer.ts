export const LOAD_USER = 'LOAD_USER';

const userFn = (state = [], action) => {
  switch (action.type) {
    case LOAD_USER:
      return action.payload;
    default:
      return state;
  }
};
export function user(state, action) {
  return userFn(state, action);
}
