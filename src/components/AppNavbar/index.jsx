import "./style.css";
import { useMemo, useState } from "react";
import {
	Paper,
	Stack,
	FormGroup,
	FormControlLabel,
	Switch,
	Box,
	IconButton,
	Dialog,
	DialogTitle,
	DialogActions,
	Button,
} from "@mui/material";

import { useTodoContext } from "@/context";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updateTodo, addTodo, deleteTodo } from "@/api/todos";

import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import BlockIcon from "@mui/icons-material/Block";
import EditOffIcon from "@mui/icons-material/EditOff";

const hour = new Date().toLocaleTimeString("en-US", {
	// en-US can be set to 'default' to use user's browser settings
	hour: "2-digit",
	minute: "2-digit",
});

export default function AppNavbar() {
	const queryClient = useQueryClient();
	const { setSelected, todos, selected } = useTodoContext();

	const [openConfirm, setOpenConfirm] = useState(false);

	const { mutate: handleAddTodoApi } = useMutation((args) => addTodo(args));
	const { mutate: handleUpdateTodoApi } = useMutation(({ query, set }) => updateTodo(query, set));
	const { mutate: handleDeleteTodoApi } = useMutation((query) => deleteTodo(query));

	// this will be true if there is a todo with _id of 'new'
	const stopCreationProcess = useMemo(() => todos?.some((todo) => todo?._id === "new"), [todos]);

	const handleAddTodo = () => {
		// remove existing todo with _id of 'new'
		if (stopCreationProcess) {
			queryClient.setQueryData(["get-todos"], (prev) => {
				return prev.filter((todo) => todo._id !== "new");
			});

			setSelected(null);
		} else {
			// add new todo with _id of 'new'
			const newTodo = {
				_id: "new",
				title: "New Todo",
				body: `${hour} - New Todo`,
				completed: false,
				priority: "LOW",
			};

			queryClient.setQueryData(["get-todos"], (prev) => {
				return [newTodo, ...prev];
			});

			// automatically select the new todo
			setSelected(newTodo);
		}
	};

	const handleCompletedChange = (e) => {
		const { checked } = e.target;

		delete selected.isEditing;
		// update the todo with the new completed value
		handleUpdateTodoApi(
			{
				query: { _id: selected._id },
				set: {
					...selected,
					completed: checked,
				},
			},
			{
				onSuccess: ({ _id }) => {
					// update cache to the new value
					queryClient.setQueryData(["get-todos"], (prev) => {
						return prev.map((todo) => {
							if (todo._id === _id) {
								return { ...selected, completed: checked };
							}
							return todo;
						});
					});
					setSelected((prev) => ({ ...prev, completed: checked }));
				},
			}
		);
	};

	const handleSaveTodo = () => {
		if (selected.isEditing) {
			// update todo
			handleUpdateTodoApi(
				{
					query: { _id: selected._id },
					set: {
						title: selected.title,
						body: selected.body,
					},
				},
				{
					onSuccess: ({ _id }) => {
						// update cache to the new value
						queryClient.setQueryData(["get-todos"], (prev) => {
							return prev.map((todo) => {
								if (todo._id === _id) {
									return { ...selected, isEditing: false };
								}
								return todo;
							});
						});
						setSelected((prev) => ({ ...prev, isEditing: false }));
					},
				}
			);
		} else {
			// create new todo
			const newTodo = {
				title: selected.title,
				body: selected.body,
				completed: selected.completed,
				priority: selected.priority,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};

			handleAddTodoApi(newTodo, {
				onSuccess: ({ _id }) => {
					// update cache to the new value
					queryClient.setQueryData(["get-todos"], (prev) => {
						return prev.map((todo) => {
							if (todo._id === "new") {
								return { ...newTodo, _id };
							}
							return todo;
						});
					});

					setSelected({ ...newTodo, _id });
				},
			});
		}
	};

	const handleIsEditing = () => {
		setSelected((prev) => ({ ...prev, isEditing: !prev.isEditing }));
	};

	const handleDeleteTodo = () => {
		handleDeleteTodoApi(
			{ _id: selected._id },
			{
				onSuccess: () => {
					// remove todo from cache
					queryClient.setQueryData(["get-todos"], (prev) => {
						return prev.filter((todo) => todo._id !== selected._id);
					});
					setSelected(null);
				},
			}
		);

		setOpenConfirm(false);
	};

	return (
		<Paper component="nav" className="navbar-wrapper">
			<Stack direction="row" justifyContent="space-between" alignItems="center">
				<FormGroup>
					{!!selected && selected?._id !== "new" && (
						<FormControlLabel
							checked={selected.completed}
							onChange={handleCompletedChange}
							control={<Switch color="success" />}
							label="Done"
							componentsProps={{
								typography: {
									variant: "body1",
									color: "gray",
								},
							}}
						/>
					)}
				</FormGroup>

				<Box>
					{!!selected && (
						<>
							{selected?._id !== "new" && (
								<IconButton onClick={handleIsEditing}>
									{selected?.isEditing ? <EditOffIcon color="error" /> : <EditIcon />}
								</IconButton>
							)}

							{selected?._id === "new" || selected?.isEditing ? (
								<IconButton
									disabled={!selected?.title?.length || !selected?.body?.length}
									onClick={handleSaveTodo}
								>
									<CheckIcon
										color={
											!selected?.title?.length || !selected?.body?.length ? "disabled" : "success"
										}
									/>
								</IconButton>
							) : (
								<IconButton
									onClick={() => {
										setOpenConfirm(true);
									}}
								>
									<DeleteIcon />
								</IconButton>
							)}
						</>
					)}

					{!selected?.isEditing && (
						<IconButton onClick={handleAddTodo}>
							{stopCreationProcess ? <BlockIcon color="error" /> : <AddIcon />}
						</IconButton>
					)}
				</Box>
			</Stack>

			<Dialog
				onClose={() => {
					setOpenConfirm(false);
				}}
				open={openConfirm}
			>
				<DialogTitle>Are you sure you want to delete this todo?</DialogTitle>
				<DialogActions>
					<Button onClick={handleDeleteTodo} color="error">
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</Paper>
	);
}
