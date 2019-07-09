import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './index.less';
import Selector from '../selector';

const noop = () => {};

function Group(props) {
	const { value, onChange, className, defaultValue, horizontal, vertical, ...other } = props;
	const [currentValue, setCurrentValue] = useState(defaultValue);

	const isChecked = val => val === currentValue;
	const onChangeAction = val => {
		setCurrentValue(val);
		onChange(val);
	};

	useEffect(() => {
		setCurrentValue(value === undefined ? defaultValue : value);
	}, [value]);

	return (
		<Selector.Group
			{...other}
			isChecked={isChecked}
			onChange={onChangeAction}
			className={classnames('radio-group', { horizontal, vertical }, className)}
		/>
	)
}

Group.propTypes = {
	defaultValue: PropTypes.node,
	value: PropTypes.node,
	onChange: PropTypes.func,
	disabled: PropTypes.bool
};

Group.defaultProps = {
	defaultValue: undefined,
	value: undefined,
	onChange: noop,
	disabled: false
};

class Radio extends React.Component {

	static propTypes = {
		value: PropTypes.node.isRequired,
		checked: PropTypes.bool,
	};

	static defaultProps = {
		checked: false,
	};

	static Group = Group;

	shouldComponentUpdate(nextProps) {

		const { checked, disabled } = nextProps;
		const { checked: prevChecked, disabled: prevDisabled } = this.props;

		return checked !== prevChecked || disabled !== prevDisabled;
	}

	render() {
		return <Selector type='radio' classSelector='radio' {...this.props}/>
	}

}

export default Radio;
