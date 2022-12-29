import { Box, Stack, styled, TextField, Typography } from "@mui/material";
import React from "react";

const StyledTextField = styled(TextField)({
  color: "white",
//   backgroundColor: "white",
});

const FormInput = (props) => {
  const {placeHolder, label1,onChange, ...inputProps } = props;
  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        mb={2.5}
      >
        <Box>
          <Typography sx={{ fontSize: "0.9rem", textTransform: "capitalize" }}>
            {label1} :
          </Typography>
        </Box>
        <StyledTextField
          margin="normal"
        //   required
          fullWidth
          size="small"
          label={placeHolder}
        //   value={value}
          onChange={onChange}
        //   type={type}
        {...inputProps}
        //   autoComplete="email"
        //   autoFocus
          sx={{ maxWidth: "34ch" }}
          InputLabelProps={{
            style: { color: "gray", fontSize: "0.9rem" },
          }}
        />
      </Stack>
    </>
  );
};

export default FormInput;
