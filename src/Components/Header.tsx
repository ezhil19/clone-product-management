import { Box } from "@mui/system";
import React, { ReactElement, useState, useReducer, useEffect } from "react";
import styled from "styled-components";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Paper, { PaperProps } from "@mui/material/Paper";
import Draggable from "react-draggable";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import axios from "axios";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";

const FieldsParts = [
  { title: "Engine" },
  { title: "Tyre" },
  { title: "Light" },
  { title: "Seat" },
];

function PaperComponent(props: PaperProps) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}
const groupping = (data: any, overallData: any, productionDatas: any) => {
  let result: any = [...overallData];
  // data.forEach((res, i) => {
  if (result.length > 0) {
    // result.forEach((IndividualGroupArr, IndividualIndex) => {
    let getUniqueCondition = [];

    for (let [IndividualIndex, IndividualGroupArr] of result.entries()) {
      if (
        IndividualGroupArr.some((IndividualProps: any) => {
          return data.partName == IndividualProps.partName;
        })
      ) {
        getUniqueCondition.push(false);
        continue;
      } else {
        result[IndividualIndex].push(data);
        getUniqueCondition = [];
        break;
      }
    }
    if (
      getUniqueCondition.length > 0 &&
      getUniqueCondition.every((boo) => boo == false)
    ) {
      result.push([data]);
    }
  } else {
    result.push([data]);
  }
  let production = result.filter((arr: any) => arr.length == 4);
  production =
    production.length > 0
      ? [...productionDatas, ...production]
      : [...productionDatas];
  let spareParts = result.filter((arr: any) => arr.length < 4);
  return { production, spareParts };
};

interface User {
  partName: string;
  title: any;
}

export default function Header(props: User): ReactJSXElement {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = useState("");
  const [spareParts, setspareParts] = useState<any>([]);
  const [production, setProduction] = useState<any>([]);
  const [delivery, setdelivery] = useState<any>([]);
  const [user, setUser] = useState<any>([]);

  const handleSelect = (e: any) => {
    setValue(e.target.value);
    const { value } = e.target;
    console.log("value", value);
  };
  const onMoveDelivery = (index: number) => {
    console.log(production);
    let product = [...production];
    let removedProduct = product.splice(index, 1);
    console.log("removed pd", removedProduct);
    let deliveryList = [...delivery];
    deliveryList.push(...removedProduct);

    setProduction(product);
    setdelivery(deliveryList);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function onPostData(e: { preventDefault: () => void }) {
    e.preventDefault();
    const postData = { partName: value };
    console.log("first", postData);
    const result = groupping(postData, spareParts, production);

    if (!value || null) {
      alert("please select the stage");
    }
    return axios
      .post<User>("http://localhost:3500/postData", postData)
      .then((response: any) => {
        setUser((prevState: any) => {
          return prevState.concat(response.data);
        });
        setspareParts(result.spareParts);
        setProduction(result.production);
        handleClose();
      });
  }

  return (
    <Grid container>
      <Grid item style={{ display: "flex" }}>
        <Box
          sx={{
            display: "flex",
            height: "100vh",
            justifyContent: "space-around",
            "& > :not(style)": {
              m: 6,
              width: 300,
            },
          }}
        >
          <Paper
            elevation={3}
            style={{
              backgroundColor: "#dfe6e0",
              overflow: "auto",
              height: "100%",
            }}
          >
            <div style={{ display: "flex" }}>
              <span
                style={{
                  fontFamily: "Fredoka, sans-serif",
                  fontSize: "1rem",
                  fontWeight: 600,
                  margin: "20px",
                  textTransform: "uppercase",
                }}
              >
                Spare Parts
              </span>
              <div>
                <Tooltip title="ADD">
                  <IconButton
                    onClick={handleClickOpen}
                    style={{ cursor: "pointer" }}
                  >
                    <AddCircleIcon color="primary" fontSize="large" />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
            {spareParts &&
              spareParts.map((res: any) => (
                <Grid
                  item
                  style={{
                    display: "flex",
                    border: " 3px solid rgb(170 185 255)",
                    padding: "10px",
                    marginBottom: "16px",
                    borderRadius: "5px",
                    width: "90%",
                    position: "relative",
                  }}
                >
                  {res.map((obj: any) => (
                    <Card
                      style={{
                        padding: "5px",
                        marginRight: "5px",
                        animation: "mymove 5s infinite",
                        animationDelay: "2s",
                      }}
                    >
                      {obj.partName}
                    </Card>
                  ))}
                  <Grid
                    item
                    style={{
                      width: "25px",
                      height: "25px",
                      borderRadius: "50%",
                      backgroundColor: "#fff",
                      textAlign: "center",
                      position: "absolute",
                      right: "-6px",
                      top: "-14px",
                    }}
                  >
                    {res.length}
                  </Grid>
                </Grid>
              ))}
            <Dialog
              open={open}
              onClose={handleClose}
              PaperComponent={PaperComponent}
              aria-labelledby="draggable-dialog-title"
            >
              <DialogTitle
                style={{ cursor: "move" }}
                id="draggable-dialog-title"
              ></DialogTitle>
              <DialogContent>
                <Stack spacing={2} sx={{ width: 300 }}>
                  <Autocomplete
                    id="size-small-standard"
                    size="small"
                    options={FieldsParts}
                    getOptionLabel={(option) => option.title}
                    //   defaultValue={FieldsParts[]}
                    renderInput={(params) => (
                      <TextField
                        required
                        {...params}
                        variant="standard"
                        label="Select parts"
                        onSelect={handleSelect}
                      />
                    )}
                  />
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button
                  autoFocus
                  onClick={handleClose}
                  style={{ cursor: "pointer" }}
                >
                  Cancel
                </Button>
                <Button onClick={onPostData} style={{ cursor: "pointer" }}>
                  Submit
                </Button>
              </DialogActions>
            </Dialog>
          </Paper>
          <Paper
            style={{
              display: "flex",
              flexFlow: "column",
              backgroundColor: "#dfe6e0",
              overflow: "auto",
              height: "100%",
            }}
          >
            <Typography
              style={{
                fontFamily: "Fredoka, sans-serif",
                fontSize: "1rem",
                fontWeight: 600,
                margin: "20px",
                textTransform: "uppercase",
              }}
            >
              <span>Production</span>
            </Typography>
            <div style={{ display: "flex", justifyContent: "end" }}>
              In Stack : {production.length}
            </div>
            {production.length > 0 &&
              production.map((res: any, index: number) => (
                <div
                  style={{
                    width: "90%",
                    display: "flex",
                    flexFlow: "column",
                    margin: "0 auto",
                    textAlign: "center",
                    border: " 3px solid rgb(170 185 255)",
                    flexWrap: "wrap",
                    gap: 7,
                    padding: "7px",
                    borderRadius: "5px",
                  }}
                >
                  {res.map((obj: any) => (
                    <Card>{obj.partName}</Card>
                  ))}
                  <Button
                    onClick={() => {
                      onMoveDelivery(index);
                    }}
                    variant="contained"
                  >
                    <ShoppingCartCheckoutIcon />
                    Move to Delivery
                  </Button>
                </div>
              ))}
          </Paper>
          <Paper
            elevation={3}
            style={{
              display: "flex",
              backgroundColor: "#dfe6e0",
              flexFlow: "column",
              overflow: "auto",
              height: "100%",
            }}
          >
            <Typography
              style={{
                fontFamily: "Fredoka, sans-serif",
                fontSize: "1rem",
                fontWeight: 600,
                margin: "20px",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              <span>Delivery</span>
            </Typography>
            <div style={{ display: "flex", justifyContent: "end" }}>
              Total Delivery : {delivery.length}
            </div>
            {delivery.length > 0 &&
              delivery.map((res: any, index: number) => (
                <div
                  style={{
                    width: "90%",
                    display: "flex",
                    flexFlow: "column",
                    margin: "0 auto",
                    textAlign: "center",
                    border: " 3px solid rgb(95 251 65)",
                    flexWrap: "wrap",
                    gap: 7,
                    padding: "7px",
                    borderRadius: "5px",
                  }}
                >
                  {res.map((obj: any) => (
                    <Card key={res.id}>{obj.partName}</Card>
                  ))}
                </div>
              ))}
          </Paper>
        </Box>
      </Grid>
    </Grid>
  );
}
