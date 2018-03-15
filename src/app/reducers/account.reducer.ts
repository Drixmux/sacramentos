export const LOAD_ACCOUNT = 'LOAD_ACCOUNT';

const accountFn = (state = [], action) => {
  switch (action.type) {
    case LOAD_ACCOUNT:
      return action.payload;
    default:
      return state;
  }
};
export function account(state, action) {
  return accountFn(state, action);
}
