export const LOAD_ALL_JURISDICTION = 'LOAD_ALL_JURISDICTION';

const jurisdictionFn = (state = [], action) => {
  switch (action.type) {
    case LOAD_ALL_JURISDICTION:
      return action.payload;
    default:
      return state;
  }
};
export function jurisdiction(state, action) {
  return jurisdictionFn (state, action);
}
