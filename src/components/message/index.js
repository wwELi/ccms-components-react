import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import './index.less';
import Icon from '../icon';

const DEFAULTOPTS = { duration: 3 };

const MESSAGE_TYPE = {
	'success': {
		icon: 'duihao'
	},
	'error': {
		icon: 'gantanhao'
	}
};

let wraper = null;

class MessageEntity extends Component {

	static removeWraper() {
		if (!wraper.children.length) {
			ReactDOM.unmountComponentAtNode(wraper);
			document.body.removeChild(wraper);
			wraper = null;
		}
	}

	constructor(props) {
		super(props);
		this.noticeRef = React.createRef();
		this.closed = false;
	}

	componentDidMount() {
		this.startTimer();
		setTimeout(() => {
			this.noticeRef.current.classList.add('animation');
		}, 100);
	}

	componentWillUnmount() {
		this.onHandleClose();
	}

	/**
	 * 关闭提示信息
	 */
	onHandleClose = () => {
		if (this.closed) return;
		this.closed = true;

		this.stopTimer();

		const { container } = this.props;
		const { current: currentNotice } = this.noticeRef;

		currentNotice.classList.add('disappear');

		// 监听动画完成
		currentNotice.addEventListener('webkitTransitionEnd', () => {
			ReactDOM.unmountComponentAtNode(container);
			wraper.removeChild(container);

			MessageEntity.removeWraper();
		}, { once: true, capture: true });
	};



	/**
	 * 自动关闭提示信息
	 */
	startTimer() {
		const { duration } = this.props;
		if (duration > 0) {
			this.timeOut = setTimeout(() => {
				this.onHandleClose();
			}, duration * 1000)
		}
	}

	/**
	 * 清除定时器
	 */
	stopTimer() {
		clearTimeout(this.timeOut);
	}

	render() {
		const { type, msg } = this.props;

		return (
			<div className={`${type}-msg notice`} ref={this.noticeRef}>
				<Icon type={`${MESSAGE_TYPE[type].icon}`} className="tag-icon"></Icon>
				<p className="msg-text">{msg}</p>
				<Icon type="x" onClick={this.onHandleClose} className="close-icon"></Icon>
			</div>
		)
	}
}

function entity(props) {
	if (!wraper) {
		wraper = document.createElement('div');
	}
	wraper.classList.add('message');

	const container = document.createElement('div');
	ReactDOM.render(<MessageEntity {...props} container={container}/>, container);

	wraper.appendChild(container);
	document.body.appendChild(wraper)
}

const message = {
	error(msg, opts) {
		const options = Object.assign({}, DEFAULTOPTS, opts);
		entity({
			type: 'error',
			msg,
			duration: options.duration
		})
	},
	success(msg, opts) {
		const options = Object.assign({}, DEFAULTOPTS, opts);
		entity({
			type: 'success',
			msg,
			duration: options.duration
		})
	}
};

MessageEntity.propTypes = {
	msg: PropTypes.string.isRequired,
	duration: PropTypes.number.isRequired
};

export default message;
