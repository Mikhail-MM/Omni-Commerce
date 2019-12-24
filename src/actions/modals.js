export function showModal(modalType, modalProps) {
  return {
    type: 'SHOW_MODAL',
    modalType,
    modalProps,
  };
}

export function hideModal() {
  return {
    type: 'HIDE_MODAL',
  };
}
