import React, { useContext, useState } from "react";
import { Context } from "../../context/ContextProvider";
import axios from "axios";
import { useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import Notification from "../../Components/Notification";
import DownloadIcon from "@mui/icons-material/Download";
import {
  Paper,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DialogActions,
  FormHelperText,
  Grid,
  IconButton,
} from "@mui/material";
import useTable from "../../Components/useTable";
import { Search } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmDialog from "../../Components/ConfirmDialog";
import { Form, Formik } from "formik";
import moment from "moment";
import UpdateInwards from "./UpdateInwards";
import { useMemo } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
const Excel = require("exceljs");

const useStyles = makeStyles((theme) => ({
  pageContent: {
    padding: theme.spacing(3),
  },
  searchInput: {
    width: "75%",
  },
  customTitle: {
    margin: 0,
    padding: theme.spacing(2),
    backgroundColor: "#000000",

    color: theme.palette.common.white,
    textAlign: "center",
  },
}));

export default function Inwards() {
  const inwardsExcel = async () => {
    let reportData = [];

    for (let i = 0; i < inwards.length; i++) {
      let item = inwards[i];

      let obj = {
        Godown: item.godown.location,
        "Godown Capacity": item.godown.capacityInQuintals,
        "Product Name": item.product.name,
        "Product Price": item.product.price,
        "Product Qty": item.quantity,
        "Supplier Name": item.supplier.name,
        "Supply Date": item.supply_date,
        "Invoice No.": item.invoice.invoiceNo,
        "Bill Value": item.invoice.billValue,
        "Receipt No.": item.receipt_no,
      };

      reportData.push(obj);
    }

    let workbook = new Excel.Workbook();

    let keys = Object.keys(reportData[0]);

    let headers = getColumnHeaders(keys, keys);

    let columnHeaders = getExcelColumnHeaders(headers);

    let sheet = workbook.addWorksheet("Inwards", {
      views: [{ state: "frozen", ySplit: 1 }],
    });

    console.log("Headers", headers, "Column Headers", columnHeaders);

    sheet.columns = columnHeaders;

    // add data to excel sheet
    sheet.addRows(reportData);

    // make the header bold
    sheet.getRow(1).font = { bold: true };

    let fileBuffer = await workbook.xlsx.writeBuffer();

    const fileBlob = new Blob([fileBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const fileName = `${"Inwards"}_${new Date().toISOString()}.xlsx`;

    const url = URL.createObjectURL(fileBlob);

    let link = document.createElement("a");

    link.href = url;

    link.setAttribute("download", fileName);

    document.body.appendChild(link);

    link.click();

    URL.revokeObjectURL(url);
  };

  const getColumnHeaders = (columns, keys = []) => {
    const columnHeaders = [];
    for (let i = 0; i < columns.length; i++) {
      let currrentColumn = columns[i].trim();
      columnHeaders.push({
        header: currrentColumn,
        key: keys[i] ? keys[i] : currrentColumn,
      });
    }

    return columnHeaders;
  };

  const getExcelColumnHeaders = (headers) => {
    let columnHeaders = [];
    for (let i = 0; i < headers.length; i++) {
      columnHeaders.push({
        header: headers[i].header,
        key: headers[i].key,
        width:
          headers[i].header === "Message" ? 50 : headers[i].header.length + 10,
        style: {
          alignment: {
            vertical: "middle",
            horizontal: "center",
            wrapText: true,
          },
          bgColor: { argb: "#008000" },
        },
      });
    }

    return columnHeaders;
  };

  const headCells = useMemo(
    () => [
      { id: "godown", label: "Godown" },
      { id: "product_name", label: "Product name" },
      { id: "supplier_name", label: "Supplier name" },
      { id: "supply_date", label: "Supply date" },
      { id: "invoice_no", label: "Invoice number" },
      { id: "receipt_no", label: "Receipt number" },
    ],
    []
  );

  const [user] = useContext(Context);

  useEffect(() => {
    if (user.role === "manager") {
      headCells.push({ id: "actions", label: "Actions", disableSorting: true });
    }
  }, [user.role]);

  const classes = useStyles();
  const [inwards, setInwards] = useState(null);
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

  const [godowns, setGodowns] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalItem, setEditModalItem] = useState(null);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(inwards, headCells, filterFn);

  const handleAddModalOpen = () => {
    setAddModalOpen(true);
  };
  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const handleEditModalOpen = (inwards) => {
    setEditModalItem(inwards);
  };
  const handleEditModalClose = () => {
    setEditModalItem(null);
    getData();
  };

  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (items) => {
        if (target.value === "") return items;
        else
          return items.filter((x) =>
            x.supplier.name.toLowerCase().includes(target.value)
          );
      },
    });
  };

  const handleDelete = async (id) => {
    await axios
      .delete(`http://localhost:8080/api/inwards/${id}`)
      .then((response) => {
        setNotify({
          isOpen: true,
          message: "Record deleted successfully",
          type: "success",
        });
        setInwards(inwards.filter((record) => record.id !== id));
      })
      .catch((error) => {
        setNotify({
          isOpen: true,
          message: "Oops! An error occurred while performing this operation.",
          type: "error",
        });
        console.error({ data: error.response.data, status: error.response.status });
      });

    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
  };

  const validationSchema = Yup.object().shape({
    godownId: Yup.number().required("Godown is required"),
    productId: Yup.number().required("Product is required"),
    supplierId: Yup.number().required("Supplier is required"),
    supplyDate: Yup.date().required("Date is required"),
    receiptNo: Yup.number().required("Receipt number is required"),
    quantity: Yup.number().required("Quantity is required"),
    invoiceNo: Yup.string().required("Invoice number is required"),
    billCheckedById: Yup.string().required("This field is required"),
  });
  const formik = useFormik({
    initialValues: {
      godownId: null,
      productId: null,
      supplierId: null,
      supplyDate: null,
      receiptNo: null,
      quantity: null,
      invoiceNo: null,
      billCheckedById: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let formData = {};
      formData["godown"] = {
        id: values.godownId,
      };
      formData["product"] = {
        id: values.productId,
      };
      formData["quantity"] = values.quantity;
      formData["supplier"] = {
        id: values.supplierId,
      };

      const supplyDateObj = new Date(values.supplyDate);
      const formattedSupplyDate = moment(supplyDateObj).format("DD/MM/YYYY");
      formData["supplyDate"] = formattedSupplyDate;

      formData["receiptNo"] = values.receiptNo;
      formData["invoice"] = {
        invoiceNo: values.invoiceNo,
        billCheckedBy: {
          id: values.billCheckedById,
        },
      };

      console.log(formData);

      axios
        .post("http://localhost:8080/api/inwards", formData)
        .then((response) => {
          handleAddModalClose();
          setNotify({
            isOpen: true,
            message: "Record submitted successfully",
            type: "success",
          });
          getData();
        })
        .catch((error) => {
          setNotify({
            isOpen: true,
            message: "Oops! An error occurred while performing this operation.",
            type: "error",
          });
          if (error.response.data.code === "UNIQUE_CONSTRAINT_VIOLATION") {
            const field = error.response.data.field.replace(/_([a-z])/g, g => g[1].toUpperCase());
            if (field === "receiptNo") {
              formik.setFieldError(field, "This receipt number already exists");
            }
            else if (field === "invoiceNo") {
              formik.setFieldError(field, "This invoice number already exists");
            }
          }
          console.error({ data: error.response.data, status: error.response.status });
        });
    },
  });

  function getData() {
    let inwardsEndpoint = "http://localhost:8080/api/inwards";

    if (user.role !== "superadmin") {
      inwardsEndpoint = inwardsEndpoint + `?godownId=${user.godown?.id}`;
    }

    axios
      .get(inwardsEndpoint)
      .then((res) => {
        let rows = [];
        for (let i = 0; i < res.data.length; i++) {
          let item = res.data[i];
          console.log(item);
          let obj = {
            id: item.id,
            godown: item.godown,
            product: item.product,
            quantity: item.quantity,
            supplier: item.supplier,
            supply_date: item.supplyDate,
            invoice: item.invoice,
            receipt_no: item.receiptNo,
          };
          rows.push(obj);
        }
        rows.sort(
          (r1, r2) => Date.parse(r1.supply_date) - Date.parse(r2.supply_date)
        );
        setInwards(rows);
      })
      .catch((error) => console.error({ data: error.response.data, status: error.response.status }));

    axios
      .get(`http://localhost:8080/api/godowns/${user.godown?.id}`)
      .then((res) => {
        setGodowns([res.data]);
      })
      .catch((error) => console.error({ data: error.response.data, status: error.response.status }));

    axios
      .get(`http://localhost:8080/api/products`)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((error) => console.error({ data: error.response.data, status: error.response.status }));

    axios
      .get("http://localhost:8080/api/suppliers")
      .then((res) => {
        setSuppliers(res.data);
      })
      .catch((error) => console.error({ data: error.response.data, status: error.response.status }));

    axios
      .get(`http://localhost:8080/api/employees?godownId=${user.godown?.id}`)
      .then((res) => {
        setEmployees(res.data);
      })
      .catch((error) => console.error({ data: error.response.data, status: error.response.status }));
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (!addModalOpen) {
      formik.resetForm();
    }
  }, [addModalOpen]);

  return (
    <>
      <Paper className={classes.pageContent}>
        <Toolbar>
          <Grid container spacing={2} direction="row">
            <Grid item>
              <TextField
                disabled={recordsAfterPagingAndSorting()?.length === 0}
                label="Search by supplier name"
                className={classes.searchInput}
                sx={{ width: "680px" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                onChange={handleSearch}
              />
            </Grid>

            <Grid
              item
              style={{
                marginLeft: "auto",
                marginTop: "auto",
                marginBottom: "auto",
              }}
            >
              <IconButton color="success" onClick={inwardsExcel}>
                <DownloadIcon />
              </IconButton>
              {user.role === "manager" && (
                <Button
                  style={{ marginLeft: "8px" }}
                  variant="outlined"
                  startIcon={<AddIcon />}
                  className={classes.newButton}
                  onClick={handleAddModalOpen}
                >
                  Add new
                </Button>
              )}
            </Grid>
          </Grid>
        </Toolbar>
        {recordsAfterPagingAndSorting()?.length === 0 ? (
          <Grid sx={{ mt: 2, ml: 3 }}>
            There are currently 0 inwards records.
          </Grid>
        ) : (
          <>
            <TblContainer>
              <TblHead />
              <TableBody>
                {recordsAfterPagingAndSorting()?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.godown.location}
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        component="p"
                      >
                        {"Capacity: " + item.godown.capacityInQuintals}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {item.product.name}
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        component="p"
                      >
                        {"Price: " + item.product.price}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        component="p"
                      >
                        {"Quantity: " + item.quantity}
                      </Typography>
                    </TableCell>
                    <TableCell>{item.supplier.name}</TableCell>
                    <TableCell>{item.supply_date}</TableCell>
                    <TableCell>
                      {item.invoice.invoiceNo}
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        component="p"
                      >
                        {"Bill value: " + item.invoice.billValue}
                      </Typography>
                    </TableCell>
                    <TableCell>{item.receipt_no}</TableCell>
                    {user.role === "manager" && (
                      <TableCell>
                        <Button
                          onClick={() => {
                            handleEditModalOpen(item);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </Button>
                        <Button
                          onClick={() => {
                            setConfirmDialog({
                              isOpen: true,
                              title: "Are you sure to delete this record?",
                              subTitle: "You can't undo this operation",
                              onConfirm: () => {
                                handleDelete(item.id);
                              },
                            });
                          }}
                        >
                          <DeleteIcon fontSize="small" color="error" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </TblContainer>
            <TblPagination />
          </>
        )}
      </Paper>
      <Dialog
        open={addModalOpen}
        onClose={handleAddModalClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title" className={classes.customTitle}>
          Add inwards
        </DialogTitle>
        <DialogContent>
          <Formik>
            {(formikProps) => (
              <Form onSubmit={formik.handleSubmit}>
                <div
                  style={{
                    marginTop: "32px",
                    marginBottom: "16px",
                    display: "grid",
                    gridTemplateColumns: "auto auto",
                    columnGap: "16px",
                    rowGap: "24px",
                  }}
                >
                  <FormControl>
                    <InputLabel id="godownIdLabel">Godown</InputLabel>
                    <Select
                      labelId="godownIdLabel"
                      id="godownId"
                      label="Godown"
                      {...formik.getFieldProps("godownId")}
                      error={
                        formik.touched.godownId && formik.errors.godownId
                          ? true
                          : false
                      }
                    >
                      {godowns.map((godown, index) => (
                        <MenuItem key={index} value={godown.id}>
                          {godown.location}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.godownId && formik.errors.godownId && (
                      <FormHelperText error>
                        {formik.touched.godownId && formik.errors.godownId}
                      </FormHelperText>
                    )}
                  </FormControl>
                  <FormControl>
                    <InputLabel id="productIdLabel">Product</InputLabel>
                    <Select
                      labelId="productIdLabel"
                      id="productId"
                      label="Product"
                      {...formik.getFieldProps("productId")}
                      error={
                        formik.touched.productId && formik.errors.productId
                          ? true
                          : false
                      }
                    >
                      {products.map((product, index) => (
                        <MenuItem key={index} value={product.id}>
                          {product.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.productId && formik.errors.productId && (
                      <FormHelperText error>
                        {formik.touched.productId && formik.errors.productId}
                      </FormHelperText>
                    )}
                  </FormControl>
                  <TextField
                    id="quantity"
                    label="Quantity"
                    type="number"
                    inputProps={{ min: 1 }}
                    variant="outlined"
                    {...formik.getFieldProps("quantity")}
                    error={
                      formik.touched.quantity && formik.errors.quantity
                        ? true
                        : false
                    }
                    helperText={
                      formik.touched.quantity && formik.errors.quantity
                    }
                  />
                  <TextField
                    id="supplyDate"
                    label="Supply date"
                    type="date"
                    variant="outlined"
                    {...formik.getFieldProps("supplyDate")}
                    error={
                      formik.touched.supplyDate && formik.errors.supplyDate
                        ? true
                        : false
                    }
                    helperText={
                      formik.touched.supplyDate && formik.errors.supplyDate
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <FormControl>
                    <InputLabel id="supplierIdLabel">Supplier</InputLabel>
                    <Select
                      labelId="supplierIdLabel"
                      id="supplierId"
                      label="Supplier"
                      {...formik.getFieldProps("supplierId")}
                      error={
                        formik.touched.supplierId && formik.errors.supplierId
                          ? true
                          : false
                      }
                    >
                      {suppliers.map((supplier, index) => (
                        <MenuItem key={index} value={supplier.id}>
                          {supplier.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.supplierId && formik.errors.supplierId && (
                      <FormHelperText error>
                        {formik.touched.supplierId && formik.errors.supplierId}
                      </FormHelperText>
                    )}
                  </FormControl>
                  <TextField
                    id="receiptNo"
                    label="Receipt number"
                    type="number"
                    inputProps={{ min: 1 }}
                    variant="outlined"
                    {...formik.getFieldProps("receiptNo")}
                    error={
                      formik.touched.receiptNo && formik.errors.receiptNo
                        ? true
                        : false
                    }
                    helperText={
                      formik.touched.receiptNo && formik.errors.receiptNo
                    }
                  />
                  <TextField
                    id="invoiceNo"
                    label="Invoice number"
                    type="text"
                    variant="outlined"
                    {...formik.getFieldProps("invoiceNo")}
                    error={
                      formik.touched.invoiceNo && formik.errors.invoiceNo
                        ? true
                        : false
                    }
                    helperText={
                      formik.touched.invoiceNo && formik.errors.invoiceNo
                    }
                  />
                  <FormControl>
                    <InputLabel id="billCheckedByIdLabel">
                      Bill checked by
                    </InputLabel>
                    <Select
                      labelId="billCheckedByIdLabel"
                      id="billCheckedById"
                      label="Bill checked by"
                      {...formik.getFieldProps("billCheckedById")}
                      error={
                        formik.touched.billCheckedById &&
                          formik.errors.billCheckedById
                          ? true
                          : false
                      }
                    >
                      {employees.map((employee, index) => (
                        <MenuItem key={index} value={employee.id}>
                          {employee.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.billCheckedById &&
                      formik.errors.billCheckedById && (
                        <FormHelperText error>
                          {formik.touched.billCheckedById &&
                            formik.errors.billCheckedById}
                        </FormHelperText>
                      )}
                  </FormControl>
                </div>

                <DialogActions>
                  <Button
                    variant="outlined"
                    onClick={() => setAddModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={!formik.isValid || !formik.dirty}
                    type="submit"
                    variant="contained"
                    className={classes.actionButtons}
                  >
                    Add
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
      <Notification notify={notify} setNotify={setNotify} />
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />

      <UpdateInwards
        inwards={editModalItem}
        godowns={godowns}
        products={products}
        suppliers={suppliers}
        employees={employees}
        handleClose={handleEditModalClose}
      />
    </>
  );
}
