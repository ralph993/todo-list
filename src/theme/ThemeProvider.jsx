import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider as MuiProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
	palette: {
		success: {
			main: "#3fbd3f",
		},
	},
	components: {
		MuiButton: {
			defaultProps: {
				disableElevation: true,
			},
		},

		MuiListItemButton: {
			styleOverrides: {
				root: {
					borderRadius: 4,
					"&.Mui-selected .MuiTypography-root": {
						fontWeight: "700",
					},
				},
			},
		},

		MuiCheckbox: {
			styleOverrides: {
				root: ({ ownerState }) => {
					return {
						...ownerState,
						"& .MuiSvgIcon-root": {
							color: ownerState.checked ? "primary" : "var(--extra-light-gray)",
						},
					};
				},
			},
		},
	},
	typography: {
		fontFamily:
			"system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
	},
});

export default function ThemeProvider({ children }) {
	return (
		<MuiProvider theme={theme}>
			<CssBaseline />
			{children}
		</MuiProvider>
	);
}
