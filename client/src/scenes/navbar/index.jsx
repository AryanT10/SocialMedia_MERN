import { useState } from 'react';
import {
	Box, IconButton,
	InputBase, Typography,
	Select, MenuItem,
	FormControl, useTheme,
	useMediaQuery
} from '@mui/material';
import { Search, Message, DarkMode, LightMode, Notification, Help, Menu, Close } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { setMode, setLogout } from '../../state';
import { useNavigate } from 'react-router-dom';
import FlexBetween from '../../components/flexBetween';

const Navbar = () => {
	const [isMobileMenuToggle, setIsMobileMenuToggle] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const user = useSelector((state) => state.user);
	const isNonMobileScreen = useMediaQuery("(min-width:1000px)");

	const theme = useTheme();

	return (
		<div>
			navbar
		</div>
	);
}

export default Navbar;