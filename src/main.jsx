import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import ThemeProvider from "./theme/ThemeProvider";
import ReactQueryProvider from "./react-query/ReactQueryProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<ReactQueryProvider>
			<ThemeProvider>
				<App />
			</ThemeProvider>
		</ReactQueryProvider>
	</React.StrictMode>
);
