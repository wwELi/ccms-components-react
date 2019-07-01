import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import omit from '@utils/omit';

const ENTER_KEY_CODE = 13;
const nothing = undefined;
const noop = () => {};

let hiddenTextarea = null;

const defaultMinRows = 1;
const defaultMaxRows = 2 ** 64;

const TWIN_STYLE = [
	'border',
	'padding',
	'width',
	'height',
	'line-height',
	'font',
	'letter-spacing',
	'text-indent',
	'box-sizing'
];
const ADDON_STYLE = {
	position: 'fixed',
	left: `-9999px`,
	top: `-9999px`,
	opacity: 0,
	height: 0,
	zIndex: -1
}

function calcAutoHeight(textareaNode, value, minRows, maxRows) {
	if (!hiddenTextarea) {
		hiddenTextarea = document.createElement('textarea');
		hiddenTextarea.setAttribute('readonly', true);
		document.body.appendChild(hiddenTextarea);
	}

	const _minRows = minRows < defaultMinRows ? defaultMinRows : minRows;
	const _maxRows = maxRows <= minRows ? minRows : maxRows;

	const style = window.getComputedStyle(textareaNode);
	const twinStyle = Object.fromEntries(TWIN_STYLE.map(key => [key, style[key]]))

	hiddenTextarea.value = value;
	Object.assign(hiddenTextarea.style, twinStyle, ADDON_STYLE);

	const borderSize = parseInt(style['border-top-width'], 10) + parseInt(style['border-bottom-width'], 10);
	const paddingSize = parseInt(style['padding-top'], 10) + parseInt(style['padding-bottom'], 10);
	const lineHeight = parseInt(style['line-height'], 10);
	const boxSizing = style['box-sizing'];

	let minHeight = _minRows * lineHeight;
	let height = hiddenTextarea.scrollHeight;
	let maxHeight = _maxRows * lineHeight;

	if (boxSizing === 'border-box') {
		minHeight += borderSize + paddingSize;
		maxHeight += borderSize + paddingSize;
		height += borderSize;
	}

	return {
		minHeight,
		height,
		maxHeight,
		overflowY: 'auto'
	};
}

function destory() {
	if (hiddenTextarea) {
		document.body.removeChild(hiddenTextarea);
		hiddenTextarea = null;
	}
}

export default class Textarea extends React.PureComponent {

	static propTypes = {
		autoSize: PropTypes.bool,
		minRows: PropTypes.number,
		maxRows: PropTypes.number,
		value: PropTypes.string,
		defaultValue: PropTypes.string,
		className: PropTypes.string,
		style: PropTypes.object,
		onBlur: PropTypes.func,
		onFocus: PropTypes.func,
		onEnter: PropTypes.func,
		onChange: PropTypes.func,
		onKeyDown: PropTypes.func,
	};

	static defaultProps = {
		autoSize: false,
		minRows: defaultMinRows,
		maxRows: defaultMaxRows,
		style: {},
		value: nothing,
		defaultValue: nothing,
		className: nothing,
		onBlur: noop,
		onFocus: noop,
		onEnter: noop,
		onChange: noop,
		onKeyDown: noop
	};

	constructor(props) {
		super(props);
		const { value, defaultValue } = this.props;
		this.state = {
			value: (value === nothing ?  defaultValue : value) || '',
			autoSizeStyle: {}
		};
		this.textareaRef = React.createRef();
	}

	componentDidMount() {
		this.calcAutoHeight();
	}

	componentWillUnmount() {
		destory();
	}

	onKeyDown = evt => {
		const { onEnter, onKeyDown } = this.props;

		if (evt.keyCode === ENTER_KEY_CODE) {
			onEnter(evt);
		}
		onKeyDown(evt);
	}

	onChange = evt => {
		if (this.props.value === nothing) {
			this.setState({ value: evt.target.value }, this.calcAutoHeight);
		}
		this.props.onChange(evt);
	}

	onBlur = evt => {
		destory();
		this.props.onBlur(evt);
	}

	calcAutoHeight() {
		const { value } = this.state;
		const { current } = this.textareaRef;
		const { autoSize, minRows, maxRows } = this.props;

		if (autoSize) {
			this.setState({
				autoSizeStyle: calcAutoHeight(current, value, minRows, maxRows)
			});
		}
	}

	render() {
		const { value, autoSizeStyle } = this.state;
		const { className, style, ...others } = this.props;

		const classNames = classnames('input-textarea', className);
		const styles = { ...style, ...autoSizeStyle };
		const props = omit(others, [
			'defaultValue',
			'autoSize',
			'minRows',
			'maxRows',
			'onEnter'
		]);

		return (
			<textarea
				{...props}
				ref={this.textareaRef}
				className={classNames}
				value={value}
				style={styles}
				onBlur={this.onBlur}
				onChange={this.onChange}
				onKeyDown={this.onKeyDown} />
		);
	}
}
