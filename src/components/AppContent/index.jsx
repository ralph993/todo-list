import "./style.css";
import { useTodoContext } from "@/context";

// MUI
import { Paper, Stack, OutlinedInput, Typography, InputAdornment, IconButton, Box } from "@mui/material";

// Assets
import no_data from "@/assets/no_data.svg";
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
								onClick={(e) => {
									const value = e.target.value;

									if (value === "New Todo") {
										e.target.value = "";
									}
								}}
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
								onClick={(e) => {
									const value = e.target.value;

									if (value?.match(/^[0-9]{2}:[0-9]{2} [AP]M - New Todo/)) {
										e.target.value = "";
									}
								}}
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
				<Box
					my={20}
					width="100%"
					display="flex"
					flexDirection="column"
					justifyContent="center"
					alignItems="center"
				>
					<img width={150} src={no_data} alt="" />
					<Typography variant="overline" textAlign="center" width="100%" mt={4}>
						Select a todo to view details
					</Typography>
				</Box>
			)}
		</Paper>
	);
}
