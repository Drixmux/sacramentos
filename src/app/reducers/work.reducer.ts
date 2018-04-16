export const LOAD_ALL_WORKS = 'LOAD_ALL_WORKS';

const workFn = (state = [], action) => {
  switch (action.type) {
    case LOAD_ALL_WORKS:
      return action.payload;
    default:
      return state;
  }
};
export function work(state, action) {
  return workFn(state, action);
}
