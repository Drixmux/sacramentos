export const LOAD_CERTIFICATES = 'LOAD_CERTIFICATES';

const certificateFn = (state = [], action) => {
  switch (action.type) {
    case LOAD_CERTIFICATES:
      return action.payload;
    default:
      return state;
  }
};
export function certificate(state, action) {
  return certificateFn(state, action);
}
