import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import { prefixCls, getRootWindow } from '@utils';
import Icon from '../icon';

import './index.less';

const DEFAULT_OPTS = { duration: 3000, contextContainer: document.body };

const MESSAGE_TYPE = {
	success: {
		icon: 'check-circle-solid'
	},
	error: {
		icon: 'warning-circle-solid'
	}
};

const wraperMap = new Map();
let wraper;

function removeWraper(contextContainer) {
	if (!wraperMap.get(contextContainer).children.length) {
		ReactDOM.unmountComponentAtNode(wraper);
		contextContainer.removeChild(wraper);
		wraper = null;
	}
}

function entity(config) {
	const { type, msg, options } = config;

	const rootDocument = getRootWindow().document;
	const opts = Object.assign(
		{},
		DEFAULT_OPTS,
		{
			contextContainer: rootDocument.body
		},
		options
	);

	const props = {
		type,
		msg,
		duration: opts.duration,
		contextContainer: opts.contextContainer
	};

	const { contextContainer } = props;
	wraper = wraperMap.get(contextContainer);

	if (!wraper) {
		wraper = rootDocument.createElement('div');
		wraperMap.set(contextContainer, wraper);
	}

	let wraperClassName = `${prefixCls}-message`;

	if (contextContainer.tagName !== 'BODY') {
		const { top } = contextContainer.getBoundingClientRect();
		wraper.style.top = `${top}px`;
	}

	// 验证是否指定了className
	if (opts.className) {
		wraperClassName = `${wraperClassName} ${opts.className}`;
	}
	wraper.className = wraperClassName;

	const container = rootDocument.createElement('div');

	wraper.appendChild(container);

	contextContainer.appendChild(wraper);

	ReactDOM.render(<MessageEntity {...props} container={container} contextContainer={contextContainer} />, container);
}

class MessageEntity extends Component {
	constructor(props) {
		super(props);
		this.noticeRef = React.createRef();
		this.closed = false;
	}

	componentDidMount() {
		this.startTimer();
		this.loadTimer = setTimeout(() => {
			this.noticeRef.current.classList.add('fade-in');
		}, 100);
	}

	componentWillUnmount() {
		this.onHandleClose();
		clearTimeout(this.loadTimer);
		clearTimeout(this.closeTimer);
	}

	/**
	 * 关闭提示信息
	 */
	onHandleClose = () => {
		if (this.closed) {
			return;
		}
		this.closed = true;

		clearTimeout(this.closeTimer);

		const { container, contextContainer } = this.props;
		const { current: currentNotice } = this.noticeRef;
		wraper = wraperMap.get(contextContainer);

		currentNotice.classList.add('fade-out');

		// 监听动画完成
		// currentNotice.addEventListener(
		// 	'webkitTransitionEnd',
		// 	() => {
		ReactDOM.unmountComponentAtNode(container);
		wraper.removeChild(container);
		removeWraper(contextContainer);
		// 		},
		// 		{ once: true, capture: true }
		// 	);
	};

	/**
	 * 自动关闭提示信息
	 */
	startTimer() {
		const { duration } = this.props;
		if (duration > 0) {
			this.closeTimer = setTimeout(() => {
				this.onHandleClose();
			}, duration);
		}
	}

	render() {
		const { type, msg } = this.props;

		return (
			<div className={`${prefixCls}-message-${type} notice`} ref={this.noticeRef}>
				<Icon type={`${MESSAGE_TYPE[type].icon}`} className="tag-icon"></Icon>
				<div className="msg-text">{msg}</div>
				<Icon type="close" onClick={this.onHandleClose} className="close-icon"></Icon>
			</div>
		);
	}
}

const Message = {
	error(msg, options) {
		entity({
			type: 'error',
			msg,
			options
		});
	},
	success(msg, options) {
		entity({
			type: 'success',
			msg,
			options
		});
	}
};

MessageEntity.propTypes = {
	msg: PropTypes.node.isRequired,
	duration: PropTypes.number.isRequired
};

export default Message;
