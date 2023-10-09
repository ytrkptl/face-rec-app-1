import React from 'react';
import ReactDOM from 'react-dom';
import './LightningModal.css';

const lightningModalRoot = document.getElementById('lightning-modal-root');

class LightningModal extends React.Component {
	constructor(props) {
		super(props);
		this.el = document.createElement('div');
	}

	componentDidMount() {
		lightningModalRoot.appendChild(this.el);
	}

	componentWillUnmount() {
		lightningModalRoot.removeChild(this.el);
	}

	render() {
		return ReactDOM.createPortal(this.props.children, this.el)
	}
}

export default LightningModal;