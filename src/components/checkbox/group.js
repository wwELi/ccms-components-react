import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Selector from '../selector';

function Group(props) {

	const { value, onChange, className, ...other } = props;
	const [checkedList, setCheckList] = useState(new Set(value));

	useEffect(() => {
		setCheckList(new Set(value));
	}, [value]);

	const isChecked = val => checkedList.has(val);
	const onChangeAction = (targetValue, checked) => {
		checkedList[checked ? 'add' : 'delete'](targetValue);
		onChange([...checkedList]);
		setCheckList(new Set(checkedList));
	};

	return (
		<Selector.Group
			{...other}
			className={classnames(className, 'checkbox-group')}
			onChange={onChangeAction}
			isChecked={isChecked}
		/>
	)
}

Group.propTypes = {
	value: PropTypes.array,
	disabled: PropTypes.bool,
	onChange: PropTypes.func
};

Group.defaultProps = {
	value: [],
	disabled: false,
	onChange: () => {}
};

export default Group;

