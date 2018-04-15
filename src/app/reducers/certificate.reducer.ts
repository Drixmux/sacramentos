export const LOAD_ALL_CERTIFICATES = 'LOAD_ALL_CERTIFICATES';
export const LOAD_CERTIFICATE = 'LOAD_CERTIFICATE';
export const CREATE_CERTIFICATE = 'CREATE_CERTIFICATE';
export const UPDATE_CERTIFICATE = 'UPDATE_CERTIFICATE';
export const DELETE_CERTIFICATE = 'DELETE_CERTIFICATE';


const certificateFn = (state = [], action) => {
  switch (action.type) {
    case LOAD_ALL_CERTIFICATES:
      return action;
    case LOAD_CERTIFICATE:
      return action;
    case CREATE_CERTIFICATE:
      return action;
    case UPDATE_CERTIFICATE:
      return action;
    case DELETE_CERTIFICATE:
      return action;
    default:
      return state;
  }
};
export function certificate(state, action) {
  return certificateFn(state, action);
}
