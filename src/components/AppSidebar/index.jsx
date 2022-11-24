import "./style.css";
import { Fragment, useState, useMemo } from "react";
import clsx from "clsx";
import { useTodoContext } from "@/context";

import {
	Paper,
	List,
	ListItem,
	ListItemText,
	ListItemButton,
	Divider,
	Skeleton,
	Typography,
	OutlinedInput,
	InputAdornment,
	IconButton,
	Stack,
	FormControl,
	Menu,
	Radio,
	FormControlLabel,
	RadioGroup,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";

function SidebarLoader() {
	return Array.from({ length: 5 }).map((_, i) => (
		<Fragment key={i}>
			<ListItem>
				<ListItemText>
					<Skeleton variant="rectangular" height={40} />
				</ListItemText>
			</ListItem>
			{
				// Divider is not needed for the last item
				i !== 4 && <Divider component="li" />
			}
		</Fragment>
	));
}

export default function AppSidebar() {
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState("all");
	const { todos, isLoading, selected, setSelected } = useTodoContext();

	const [anchorEl, setAnchorEl] = useState(null);
	const openFilterMenu = Boolean(anchorEl);

	const handleSelection = (todo) => {
		setSelected(todo);
	};

	const handleSearch = (e) => {
		const { value } = e.target;
		setSearch(value);
	};

	const handleFilter = (value) => {
		setFilter(value);
		setAnchorEl(null);
	};

	const searchFilter = useMemo(() => {
		// If search is empty, return all todos
		if (!search) return todos;

		// Filter todos based on search
		return todos?.filter((todo) => {
			const { title, body } = todo;
			return (
				title.toLowerCase().includes(search.toLowerCase()) || body.toLowerCase().includes(search.toLowerCase())
			);
		});
	}, [search, todos]);

	const visibilityFilter = useMemo(() => {
		// If filter is 'all', return all todos
		if (filter === "all") return searchFilter;

		// Filter todos based on visibility filter
		return searchFilter?.filter((todo) => {
			const { completed } = todo;
			return completed === (filter === "completed" ? true : false);
		});
	}, [filter, searchFilter]);

	return (
		<>
			<Paper component="nav" className="sidebar-wrapper">
				<List
					dense
					subheader={
						<Stack
							p={1}
							mb={1}
							direction="row"
							justifyContent="space-between"
							alignItems="center"
							columnGap={1}
						>
							<OutlinedInput
								disabled={!todos?.length}
								value={search}
								onChange={handleSearch}
								variant="outlined"
								fullWidth
								placeholder="Search"
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											disabled={!todos?.length}
											onClick={() => {
												setSearch("");
											}}
											size="small"
										>
											<CloseIcon size="small" />
										</IconButton>
									</InputAdornment>
								}
								className="search-input"
							/>
							<IconButton
								onClick={(e) => {
									setAnchorEl(e.currentTarget);
								}}
								disabled={!todos?.length}
								size="small"
							>
								<FilterListIcon />
							</IconButton>
						</Stack>
					}
				>
					{isLoading ? (
						<SidebarLoader />
					) : !!visibilityFilter?.length ? (
						visibilityFilter?.map((todo, i) => (
							<Fragment key={i}>
								<ListItem disableGutters alignItems="flex-start">
									<ListItemButton
										className={clsx({
											"todo-completed": true,
											"todo-completed-in": todo.completed,
										})}
										onClick={() => handleSelection(todo)}
										selected={todo._id === selected?._id}
									>
										<ListItemText
											primary={todo.title}
											secondary={todo.body}
											secondaryTypographyProps={{
												noWrap: true,
												fontSize: 12,
											}}
										/>
									</ListItemButton>
								</ListItem>

								{
									// Divider is not needed for the last item
									i !== todos.length - 1 && <Divider component="li" />
								}
							</Fragment>
						))
					) : (
						<ListItem>
							<Typography variant="overline" textAlign="center" width="100%" mt={7}>
								No todos found.
							</Typography>
						</ListItem>
					)}
				</List>
			</Paper>

			<Menu
				anchorEl={anchorEl}
				id="account-menu"
				open={openFilterMenu}
				onClose={() => setAnchorEl(null)}
				PaperProps={{
					elevation: 0,
					sx: {
						overflow: "visible",
						filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
						mt: 1.5,
						"& .MuiAvatar-root": {
							width: 32,
							height: 32,
							ml: -0.5,
							mr: 1,
						},
						"&:before": {
							content: '""',
							display: "block",
							position: "absolute",
							top: 0,
							right: 14,
							width: 10,
							height: 10,
							bgcolor: "background.paper",
							transform: "translateY(-50%) rotate(45deg)",
							zIndex: 0,
						},
					},
				}}
				transformOrigin={{ horizontal: "right", vertical: "top" }}
				anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
			>
				<FormControl
					size="small"
					sx={{
						px: 2,
					}}
				>
					<RadioGroup>
						<FormControlLabel
							onChange={() => handleFilter("completed")}
							checked={filter === "completed"}
							value="completed"
							control={<Radio size="small" />}
							label="Completed"
						/>
						<FormControlLabel
							onChange={() => handleFilter("incomplete")}
							checked={filter === "incomplete"}
							value="no-completed"
							control={<Radio size="small" />}
							label="No Completed"
						/>
						<FormControlLabel
							onChange={() => handleFilter("all")}
							checked={filter === "all"}
							value="all"
							control={<Radio size="small" />}
							label="All"
						/>
					</RadioGroup>
				</FormControl>
			</Menu>
		</>
	);
}
