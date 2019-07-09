
import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import './index.less';

const GroupContext = React.createContext(null);

function Group(props) {

	const { value, disabled, onChange, isChecked, ...other } = props;
	const provider = { value, disabled, isChecked, onChange };

	return (
		<GroupContext.Provider value={provider}>
			<span {...other} />
		</GroupContext.Provider>
	)
}

function Component(props, ref) {

	const {
		type,
		value,
		style,
		checked,
		disabled,
		children,
		onChange,
		className,
		classSelector,
		...other
	} = props;

	const render = ctx => {

		const groupProps = ctx === null
			? { checked, onChange, disabled }
			: {
				disabled: ctx.disabled,
				checked: ctx.isChecked(value),
				onChange(evt) {
					onChange(value);
					ctx.onChange(value, evt.target.checked);
				}
			};

		return (
			<label className={classnames('selector', classSelector, className)} style={style}>
				<input
					{...other}
					ref={ref}
					type={type}
					value={value}
					{...groupProps}
					className={classnames('selector-input', `${classSelector}-input`)}
				/>
				<span className={classnames('selector-inner', `${classSelector}-inner`)} />
				<span className={classnames('selector-container', `${classSelector}-container`)}>{ children }</span>
			</label>
		)
	};

	return <GroupContext.Consumer>{ render }</GroupContext.Consumer>
}

const Selector = React.forwardRef(Component);

Selector.propTypes = {
	value: PropTypes.node.isRequired,
	checked: PropTypes.bool,
	disabled: PropTypes.bool,
	onChange: PropTypes.func,
	type: PropTypes.oneOf(['radio', 'checkbox'])
};

Selector.defaultProps = {
	checked: false,
	disabled: false,
	onChange: () => {},
};


Selector.Group = Group;

export default Selector;
