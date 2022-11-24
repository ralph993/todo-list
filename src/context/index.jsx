import { createContext, useContext } from "react";

export const TodoContext = createContext({
	todos: [],
	isLoading: false,
	selected: null,
	setSelected: () => {},
});

export const TodoProvider = ({ children, values }) => {
	return <TodoContext.Provider value={values}>{children}</TodoContext.Provider>;
};

export const useTodoContext = () => {
	return useContext(TodoContext);
};
