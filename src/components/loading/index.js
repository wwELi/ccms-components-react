import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './index.less';

class Loading extends React.PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			show: props.delay === 0
		};
	}

	componentDidMount() {
		if (this.props.delay > 0) {
			this.delayLoading();
		}
	}

	componentWillUnmount() {
		this.clearDelayLoading();
	}

	delayLoading = () => {
		this.timer = setTimeout(() => {
			this.setState({
				show: true
			});
		}, this.props.delay);
	};

	clearDelayLoading = () => {
		clearTimeout(this.timer);
	};

	render() {
		const { layer, size, tip } = this.props;
		const loadingType = classNames('loading', {
			'loading-layer': layer
		});

		return this.state.show && (
			<div className={loadingType}>
				<div className="loading-animation">
					<svg className="circular" viewBox="25 25 50 50">
						<circle className="path" cx="50" cy="50" r={size === "small" ? 15 : 20} fill="none"/>
					</svg>
				</div>
				{tip && <div className="loading-text">{tip}</div>}
			</div>
		);
	}
}

Loading.propTypes = {
	layer: PropTypes.bool,
	size: PropTypes.oneOf(['default', 'small']),
	tip: PropTypes.string,
	delay: PropTypes.number
};

Loading.defaultProps = {
	layer: false,
	size: 'default',
	tip: '',
	delay: 0
};

export default Loading;
