import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import { Buffer } from 'buffer';
import moment from "moment";
import axios from "axios";
import PublishIcon from '@mui/icons-material/Publish';
import IconButton from '@mui/material/IconButton';
import { useContext } from "react";
import { Context } from "../context/ContextProvider";

const Excel = require("exceljs");

const Input = styled("input")({
    fontSize: "18px",
    display: "inline-block",
    cursor: "pointer",
});

const ImportButton = (props) => {

    const [selectedFile, setSelectedFile] = useState(null);
    const [user] = useContext(Context);

    const handleSubmit = async (event) => {
        if (!selectedFile) {
            return;
        }
        var reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onload = async () => {
            let data = reader.result;
            console.log("data", data);
            let fileContent = Buffer.from(data, "base64");
            const workbook = new Excel.Workbook();
            await workbook.xlsx.load(fileContent);

            // excel --> json list
            let sheet = workbook.getWorksheet(1);
            let records = [];
            sheet.eachRow((row, idx) => {
                records.push(row.values);
            });

            for (let i = 1; i < records.length; i++) {
                let item = records[i];

                if (props.tableId == 'inwards') {
                    let formData = {};
                    formData["godown"] = {
                        id: item[1],
                    };
                    formData["product"] = {
                        id: item[2],
                    };
                    formData["quantity"] = item[3];
                    formData["supplier"] = {
                        id: item[4],
                    };

                    const supplyDateObj = new Date(item[5]);
                    const formattedSupplyDate = moment(supplyDateObj).format("DD/MM/YYYY");
                    formData["supplyDate"] = formattedSupplyDate;

                    formData["receiptNo"] = item[6];
                    formData["invoice"] = {
                        invoiceNo: item[7],
                        billCheckedBy: {
                            id: item[8],
                        },
                    };

                    axios
                        .post("http://localhost:8080/api/inwards", formData)
                        .then((response) => {
                            props.setNotify({
                                isOpen: true,
                                message: "Records submitted successfully",
                                type: "success",
                            });
                            props.getData();
                        })
                        .catch((error) => {

                            if (error.response.data.code === "UNIQUE_CONSTRAINT_VIOLATION") {
                                const field = error.response.data.field.replace(/_([a-z])/g, g => g[1].toUpperCase());
                                if (field === "receiptNo") {
                                    props.setNotify({
                                        isOpen: true,
                                        message: "Receipt No. should be unique for all the records. Please re-evaluate and upload again.",
                                        type: "error",
                                    });
                                }
                                else if (field === "invoiceNo") {
                                    props.setNotify({
                                        isOpen: true,
                                        message: "Invoice No. should be unique for all the records. Please re-evaluate and upload again.",
                                        type: "error",
                                    });
                                }
                            }
                        });

                    setSelectedFile(null);
                }
                else if (props.tableId == 'outwards') {
                    let formData = {};
                    formData["godown"] = {
                        id: item[1],
                    };
                    formData["product"] = {
                        id: item[2],
                    };
                    formData["quantity"] = item[3];
                    formData["deliveredTo"] = item[4];
                    formData["purpose"] = item[5];

                    const supplyDateObj = new Date(item[6]);
                    const formattedSupplyDate = moment(supplyDateObj).format("DD/MM/YYYY");
                    formData["supplyDate"] = formattedSupplyDate;

                    const deliveryDateObj = new Date(item[7]);
                    const formattedDeliveryDate =
                        moment(deliveryDateObj).format("DD/MM/YYYY");
                    formData["deliveryDate"] = formattedDeliveryDate;

                    formData["receiptNo"] = item[8];
                    formData["invoice"] = {
                        billCheckedBy: {
                            id: item[9],
                        },
                    };

                    axios
                        .post("http://localhost:8080/api/outwards", formData)
                        .then((response) => {
                            props.setNotify({
                                isOpen: true,
                                message: "Records submitted successfully",
                                type: "success",
                            });
                            props.getData();
                        })
                        .catch((error) => {

                            if (error.response.data.code === "UNIQUE_CONSTRAINT_VIOLATION") {
                                const field = error.response.data.field.replace(/_([a-z])/g, g => g[1].toUpperCase());
                                if (field === "receiptNo") {
                                    props.setNotify({
                                        isOpen: true,
                                        message: "Receipt No. should be unique for all the records. Please re-evaluate and upload again.",
                                        type: "error",
                                    });
                                }
                            }
                        });

                    setSelectedFile(null);
                }
                else if (props.tableId == 'returns') {
                    let formData = {};
                    formData["godown"] = {
                        id: item[1],
                    };
                    formData["product"] = {
                        id: item[2],
                    };
                    formData["quantity"] = item[3];
                    formData["returnedBy"] = item[4];
                    formData["reason"] = item[5];

                    const deliveryDateObj = new Date(item[6]);
                    const formattedDeliveryDate =
                        moment(deliveryDateObj).format("DD/MM/YYYY");
                    formData["deliveryDate"] = formattedDeliveryDate;

                    const returnDateObj = new Date(item[7]);
                    const formattedReturnDate = moment(returnDateObj).format("DD/MM/YYYY");
                    formData["returnDate"] = formattedReturnDate;

                    formData["receiptNo"] = item[8];
                    formData["invoice"] = {
                        invoiceNo: item[9],
                        billCheckedBy: {
                            id: item[10],
                        },
                    };

                    axios
                        .post("http://localhost:8080/api/returns", formData)
                        .then((response) => {
                            props.setNotify({
                                isOpen: true,
                                message: "Records submitted successfully",
                                type: "success",
                            });
                            props.getData();
                        })
                        .catch((error) => {

                            if (error.response.data.code === "UNIQUE_CONSTRAINT_VIOLATION") {
                                const field = error.response.data.field.replace(/_([a-z])/g, g => g[1].toUpperCase());
                                if (field === "receiptNo") {
                                    props.setNotify({
                                        isOpen: true,
                                        message: "Receipt No. should be unique for all the records. Please re-evaluate and upload again.",
                                        type: "error",
                                    });
                                }
                                else if (field === "invoiceNo") {
                                    props.setNotify({
                                        isOpen: true,
                                        message: "Invoice No. should be unique for all the records. Please re-evaluate and upload again.",
                                        type: "error",
                                    });
                                }
                            }
                        });

                    setSelectedFile(null);
                }
            }


            console.log('records', records)
        };
        reader.onerror = function (error) {
            const snak = {
                open: true,
                message: "Error while reading the file, please select the file again",
                severity: "error",
                time: null
            };
        };

    };

    const handleFileSelect = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    return (
        <React.Fragment>
            <Stack direction="row" spacing={0} >
                <label htmlFor="contained-button-file">
                    <Input
                        sx={{ width: { xs: "12rem", sm: "20rem" }, marginTop: '11px' }}
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        id="contained-button-file"
                        onChange={handleFileSelect}
                        onClick={e => (e.target.value = null)}
                        type="file"
                    />
                </label>
                <IconButton sx={{marginTop : '5px', marginLeft : ((user.role == "manager") ? '130px' : '240px' )}} color="success" onClick={handleSubmit}>
                    <PublishIcon />
                </IconButton>
            </Stack>
        </React.Fragment>
    );
};

export default ImportButton;

