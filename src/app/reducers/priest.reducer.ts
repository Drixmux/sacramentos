export const LOAD_ALL_PRIESTS= 'LOAD_ALL_PRIESTS';

const priestFn = (state = [], action) => {
  switch (action.type) {
    case LOAD_ALL_PRIESTS:
      return action.payload;
    default:
      return state;
  }
};
export function priest(state, action) {
  return priestFn(state, action);
}
