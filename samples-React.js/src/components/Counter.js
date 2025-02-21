import React, { useState } from 'react';

const Counter = (props) => {
	const [count, setCount] = useState(props.value);

	const handleCount = (value) => {
		setCount(value);
	};

	return (
		<div style={{ background: '#ffffff' }}>
			<div>
				<button className="btn" onClick={() => handleCount(count - 1)}>
					감소
				</button>
				<span>현재 값 : {count}</span>
				<button className="btn" onClick={() => handleCount(count + 1)}>
					증가
				</button>
			</div>
			<div>
				<button style={{ display: 'inline-block', width: '100%' }} onClick={() => props.handleChange(count)}>
					확인
				</button>
			</div>
		</div>
	);
};
export default Counter;
