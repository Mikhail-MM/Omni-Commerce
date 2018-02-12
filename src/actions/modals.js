export function showModal(modalType, modalProps) {
	console.log(modalProps)
	return {
		type: 'SHOW_MODAL',
		modalType: modalType,
		modalProps: modalProps
	}
}

export function hideModal() {
	return {
		type: 'HIDE_MODAL'
	}
}