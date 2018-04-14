export const LOAD_ALL_FAITHFUL = 'LOAD_ALL_FAITHFUL';
export const LOAD_FAITHFUL = 'LOAD_FAITHFUL';
export const CREATE_FAITHFUL = 'CREATE_FAITHFUL';
export const UPDATE_FAITHFUL = 'UPDATE_FAITHFUL';
export const DELETE_FAITHFUL = 'DELETE_FAITHFUL';

const faithfulFn = (state = [], action) => {
  switch (action.type) {
    case LOAD_ALL_FAITHFUL:
      return action;
    case LOAD_FAITHFUL:
      return action;
    case CREATE_FAITHFUL:
      return action;
    case UPDATE_FAITHFUL:
      return action;
    case DELETE_FAITHFUL:
      return action;
    default:
      return state;
  }
};
export function faithful(state, action) {
  return faithfulFn(state, action);
}
