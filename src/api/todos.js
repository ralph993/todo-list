import { gql, graphQlInstance } from "@/config/axios";

export const getTodos = async (queryData, sortBy = "CREATEDAT_DESC", limit = 100) => {
	const query = gql`
		query Todos($limit: Int, $sortBy: TodoSortByInput, $query: TodoQueryInput) {
			todos(limit: $limit, sortBy: $sortBy, query: $query) {
				_id
				title
				body
				createdAt
				updatedAt
				completed
			}
		}
	`;

	const variables = {
		query: queryData,
		sortBy,
		limit,
	};

	const { data } = await graphQlInstance.post("/graphql", {
		query,
		variables,
	});

	return data?.data?.todos;
};

export const addTodo = async (queryData) => {
	const query = gql`
		mutation InsertOneTodo($data: TodoInsertInput!) {
			insertOneTodo(data: $data) {
				_id
			}
		}
	`;

	const variables = {
		data: queryData,
	};

	const { data } = await graphQlInstance.post("/graphql", {
		query,
		variables,
	});

	return data?.data?.insertOneTodo;
};

export const updateTodo = async (queryData, set) => {
	const query = gql`
		mutation UpdateOneTodo($query: TodoQueryInput, $set: TodoUpdateInput!) {
			updateOneTodo(query: $query, set: $set) {
				_id
			}
		}
	`;

	const variables = {
		query: queryData,
		set,
	};

	const { data } = await graphQlInstance.post("/graphql", {
		query,
		variables,
	});

	return data?.data?.updateOneTodo;
};

export const deleteTodo = async (queryData) => {
	const query = gql`
		mutation DeleteOneTodo($query: TodoQueryInput!) {
			deleteOneTodo(query: $query) {
				_id
			}
		}
	`;

	const variables = {
		query: queryData,
	};

	const { data } = await graphQlInstance.post("/graphql", {
		query,
		variables,
	});

	return data?.data?.deleteOneTodo;
};

export const deleteTodos = async (queryData) => {
	const query = gql`
		mutation DeleteManyTodos($query: TodoQueryInput) {
			deleteManyTodos(query: $query) {
				deletedCount
			}
		}
	`;

	const variables = {
		query: queryData,
	};

	const { data } = await graphQlInstance.post("/graphql", {
		query,
		variables,
	});

	return data?.data?.deleteManyTodos;
};
