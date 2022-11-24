import "./style.css";
import { useTodoContext } from "@/context";

import { Paper, Stack, OutlinedInput, Typography, InputAdornment, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function AppContent() {
	const { selected, setSelected } = useTodoContext();

	const handleOnChange = (e, field) => {
		const { value } = e.target;
		setSelected((prev) => ({ ...prev, [field]: value }));
	};

	const handleEmptyField = (field) => {
		setSelected((prev) => ({ ...prev, [field]: "" }));
	};

	return (
		<Paper component="main" className="content-wrapper">
			{!!selected ? (
				<Stack width="100%" rowGap={2}>
					{selected._id === "new" || selected.isEditing ? (
						<>
							<OutlinedInput
								value={selected.title}
								onChange={(e) => handleOnChange(e, "title")}
								variant="outlined"
								endAdornment={
									<InputAdornment position="end">
										<IconButton onClick={() => handleEmptyField("title")}>
											<CloseIcon />
										</IconButton>
									</InputAdornment>
								}
								placeholder="Title"
							/>

							<OutlinedInput
								placeholder="Body"
								value={selected.body}
								onChange={(e) => handleOnChange(e, "body")}
								sx={{
									height: "100%",
									whiteSpace: "pre-line",
								}}
								id="outlined-multiline-flexible"
								multiline
								minRows={10}
								endAdornment={
									<InputAdornment position="end">
										<IconButton onClick={() => handleEmptyField("body")}>
											<CloseIcon />
										</IconButton>
									</InputAdornment>
								}
							/>
						</>
					) : (
						<>
							<Typography gutterBottom variant="body2" color="gray" textAlign="center" fontWeight={600}>
								{new Date(selected.createdAt).toLocaleString()}
							</Typography>
							<Typography variant="h5" fontWeight={600}>
								{selected.title}
							</Typography>
							<Typography variant="body1" whiteSpace="pre-line">
								{selected.body.replaceAll("*", "•")}
							</Typography>
						</>
					)}
				</Stack>
			) : (
				<Typography variant="overline" textAlign="center" width="100%" mt={4}>
					Select or create a todo to view details
				</Typography>
			)}
		</Paper>
	);
}
