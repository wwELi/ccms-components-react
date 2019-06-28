---
order: 4
title: 背景设置
desc: 不配置layer即为默认不带背景，layer=true带背景
---

````javascript
import React from 'react';
import Loading from 'ccms-components-react/loading';

export default class LoadingDemo extends React.Component {

	render() {
		return (
			<div className="item-type">
				<Loading layer={true}/>
			</div>
			
		);
	}
}

````
````less
.item-type {
	 height: 80px;
}
````

