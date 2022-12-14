import { useMemo, useState } from "react";
import { TodoProvider } from "@/context";

import AppNavbar from "@/components/AppNavbar";
import AppSidebar from "@/components/AppSidebar";
import AppContent from "@/components/AppContent";

// API
import { useQuery } from "@tanstack/react-query";
import { getTodos } from "@/api/todos";

// MUI
import { Grid, Stack } from "@mui/material";

export default function AppLayout({ children }) {
	const [selected, setSelected] = useState(null);

	const { data: todos, isLoading } = useQuery(["get-todos"], () => getTodos());

	const values = useMemo(
		() => ({
			todos,
			isLoading,
			selected,
			setSelected,
		}),
		[todos, isLoading, selected]
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
