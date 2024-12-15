// src: https://redux.js.org/usage/reducing-boilerplate
export function makeActionCreator(type, ...argNames) {
	return function (...args) {
		const action = { type };
		argNames.forEach((arg, index) => {
			action[argNames[index]] = args[index];
		});
		return action;
	};
}
