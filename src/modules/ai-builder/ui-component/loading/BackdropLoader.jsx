import { Backdrop, CircularProgress } from "@mui/material";
import PropTypes from "prop-types";

export const BackdropLoader = ({ open }) => {
  return (
    <div>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

BackdropLoader.propTypes = {
  open: PropTypes.bool,
};
