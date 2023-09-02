import { useState } from 'react';
import { Box, Button, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
// import { EditOutlinedIcon } from '@mui/icons-material/EditOutlined';
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from 'formik';
import * as yup from "yup";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogin } from '../../state';
import Dropzone from 'react-dropzone';
import FlexBetween from '../../components/flexBetween';

const registerSchema = yup.object().shape({
	firstName: yup.string().required("required"),
	lastName: yup.string().required("required"),
	email: yup.string().email("Invalid email").required("required"),
	password: yup.string().required("required"),
	location: yup.string().required("required"),
	occupation: yup.string().required("required"),
	picture: yup.string().required("required"),
})

const loginSchema = yup.object().shape({
	email: yup.string().email("Invalid email").required("required"),
	password: yup.string().required("required"),
});

const initialValuesRegister = {
	firstName: "",
	lastName: "",
	email: "",
	password: "",
	occupation: "",
	location: "",
	picture: "",
};

const initialValuesLogin = {
	email: "",
	password: "",
};

const Form = () => {
	const [pageType, setPageType] = useState("login");
	const { palette } = useTheme();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const isNonMobile = useMediaQuery("(min-width:600px)");
	const isLogin = pageType === "login";
	const isRegister = pageType === "register";


	const register = async (values, onSubmitProp) => {
		// this will allow us to send form info image
		const formData = new FormData();
		for (let value in values) {
			formData.append(values[value])
		}
		formData.append(`picturePath`, values.picture.name);

		const savedUserResponse = await fetch("http://localhost:3001/auth/register",
			{
				method: "POST",
				body: formData,
				
			});
		const savedUser = await savedUserResponse.json();
		onSubmitProp.resetForm();

		if (savedUser) {
			setPageType("login");
		}
	};

	const login = async (values, onSubmitProp) => {
		
		const loggedInResponse = await fetch("http://localhost:3001/auth/login",
			{
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(values),
				
			});
		const loggedIn = await loggedInResponse.json();
		onSubmitProp.resetForm();
		if (loggedIn) {
			dispatch(
				setLogin({
					user: loggedIn.user,
					token: loggedIn.token,
				})
			);
			navigate("/home");
		}
	}

	const handleFormSubmit = async (values, onSubmitProp) => { 
		if (isLogin) await loginSchema(values, onSubmitProp);
		if (isRegister) await register(values, onSubmitProp);

	};
	return (
		<Formik
			onSubmit={handleFormSubmit}
			initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
			validationSchema={isLogin ? loginSchema : registerSchema}
		>
			{({
				values,
				error,
				touched,
				handleBlur,
				handleChange,
				handleSubmit,
				setFieldValue,
				resetForm,
			}) => (
				<Form onSubmit={handleSubmit}>
					<Box
						display="grid"
						gap="30px"
						gridTemplateColumns="repeat(4,minmax(0,1fr))"
						sx={{
							"& > div": { gridColumn: isNonMobile ? undefined : "span 4" },

						}}
					>
						{isRegister && (
							<>
								<TextField
									label="First Name"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.firstName}
									name="firstName"
									error={Boolean(touched.firstName) && Boolean(error.firstName)}
									helperText={touched.firstName && error.firstName}
									sx={{ gridColumn: "span 2" }}
								/>
								<TextField
									label="Last Name"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.lastName}
									name="lastName"
									error={Boolean(touched.lastName) && Boolean(error.lastName)}
									helperText={touched.lastName && error.lastName}
									sx={{ gridColumn: "span 2" }}
								/>
								<TextField
									label="Location"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.location}
									name="location"
									error={Boolean(touched.location) && Boolean(error.location)}
									helperText={touched.location && error.location}
									sx={{ gridColumn: "span 4" }}
								/>
								<TextField
									label="Occupation"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.occupation}
									name="occupation"
									error={Boolean(touched.occupation) && Boolean(error.occupation)}
									helperText={touched.occupation && error.occupation}
									sx={{ gridColumn: "span 4" }}
								/>
								<Box
									gridColumn="span 4"
									border={`1px solid${palette.neutral.medium}`}
									borderRadius="5px"
									p="1rem"
								>
									<Dropzone
										acceptedFiles=".jpg,.jpeg,.png"
										multiple={false}
										onDrop={(acceptedFiles) => setFieldValue("picture", acceptedFiles[0])}
									>
										{({ getRootProps, getInputProps }) => (
											<Box
												{...getRootProps()}
												border={`2px dashed ${palette.primary.main}`}
												p="1rem"
												sx={{ "&:hover": { cursor: "pointer" } }}
											>
												<input {...getInputProps()} />
												{!values.picture ? (
													<p>Add Picture Here</p>
												) : (
													<FlexBetween>
														<Typography>
															{values.picture.name}
														</Typography>
														<EditOutlinedIcon />
													</FlexBetween>
												)}
											</Box>
										)}
									</Dropzone>
								</Box>
							</>
						)}
						<TextField
							label="email"
							onBlur={handleBlur}
							onChange={handleChange}
							value={values.email}
							name="email"
							error={Boolean(touched.email) && Boolean(error.email)}
							helperText={touched.email && error.email}
							sx={{ gridColumn: "span 2" }}
						/>
						<TextField
							label="password"
							type="password"
							onBlur={handleBlur}
							onChange={handleChange}
							value={values.password}
							name="email"
							error={Boolean(touched.password) && Boolean(error.password)}
							helperText={touched.password && error.password}
							sx={{ gridColumn: "span 2" }}
						/>
					</Box>

					{/* BUTTONS */}
					<Box>
						<Button
							fullWidth
							type="submit"
							sx={{
								m: "2rem 0",
								p: "1rem",
								backgroundColor: palette.primary.main,
								color: palette.background.alt,
								"&:hover": { color: palette.primary.main },
							}}
						>
							{isLogin ? "LOGIN" : "REGISTER"}
						</Button>
						<Typography
							onClick={() => {
								setPageType(isLogin ? "register" : "login");
								resetForm();
							}}
							sx={{
								textDecoration: "underline",
								color: palette.primary.main,
								"&:hover": {
									cursor: "pointer",
									color: palette.primary.light,
								}
							}}
						>
							{isLogin ?
								"Don't have an account ? Sign up here." : "Already have an account ? Login here."}
						</Typography>
					</Box>
				</Form>
			)}

		</Formik>

	)
}

export default Form;