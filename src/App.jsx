import { useMemo, useState } from "react";
import AppNavbar from "@/components/AppNavbar";
import AppSidebar from "@/components/AppSidebar";
import AppContent from "@/components/AppContent";

import { Grid, Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import { TodoProvider } from "@/context";
import { getTodos } from "@/api/todos";

export default function AppLayout({ children }) {
	const [selected, setSelected] = useState(null);

	const { data, isLoading } = useQuery(["get-todos"], async () => {
		const res = await getTodos();

		// sort todos by createdAt
		return res.sort((a, b) => {
			return new Date(b.createdAt) - new Date(a.createdAt);
		});
	});

	const values = useMemo(
		() => ({
			todos: data,
			isLoading: isLoading,
			selected: selected,
			setSelected,
		}),
		[data, isLoading, selected]
	);

	return (
		<TodoProvider values={values}>
			<Grid container className="app-wrapper" columnGap={1}>
				<Grid xs={3} item>
					<AppSidebar />
				</Grid>
				<Grid flex={1} item>
					<Stack rowGap={1} height="100%">
						<AppNavbar />
						<AppContent>{children}</AppContent>
					</Stack>
				</Grid>
			</Grid>
		</TodoProvider>
	);
}
