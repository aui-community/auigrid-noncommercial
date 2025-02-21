import React from 'react';
import './Stock.css';

const Stock = (props) => {
	const thisStyle = {
		color: '#000000'
	};

	const varStyle = {
		background: 'transparent'
	};

	if (Number(props.vars) > 0) {
		thisStyle.color = '#D90400';
		varStyle.background = "url('./assets/ico_up.gif') 0% 50% no-repeat";
	} else if (Number(props.vars) < 0) {
		thisStyle.color = '#005DDE';
		varStyle.background = "url('./assets/ico_down.gif') 0% 50% no-repeat";
	}

	return (
		<div style={thisStyle}>
			<div className="my-child1">{props.close}</div>
			<div className="my-child2" style={varStyle}>
				{props.vars}
			</div>
			<div className="my-child3">{props.gap}</div>
		</div>
	);
};
export default Stock;
