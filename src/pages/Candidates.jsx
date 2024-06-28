import { fetchCandidateDetails, searchCandidateDetails } from "../apis/candidate";
import { useDispatch, useSelector } from "react-redux";
import { addshortListedCandidates } from "../lib/slices/shortListedCandidates";
import { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  MenuItem,
  Modal,
  Typography,
} from "@mui/material";

function Candidates() {
  const [open, setOpen] = useState(false);
  const [tabledata, setTableData] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10, //customize the default page size
  });
  const [totalData, setTotalData] = useState(0);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);

  const { shortListedCandidates } = useSelector(
    (state) => state.shortListedCandidates
  );
  const dispatch = useDispatch();

  const selected = () => {
    let selected = {};
    if (shortListedCandidates) {
      shortListedCandidates.forEach((item) => (selected[item.id] = true));
      return selected;
    } else {
      return null;
    }
  };

  const [rowSelection, setRowSelection] = useState(selected);

  useEffect(() => {
    let selectedList = Object.keys(rowSelection);
    let candidates = tabledata?.filter((item) =>
      selectedList.includes(item.id + "")
    );
    dispatch(addshortListedCandidates(candidates));
  }, [rowSelection, dispatch, tabledata]);

  useEffect(() => {
    const loadData = async () => {
      let limit = pagination.pageSize;
      let skip = pagination.pageIndex * pagination.pageSize;
      let data = await fetchCandidateDetails(limit, skip, sorting, columnFilters);
      let tdata = data.users.map((item) => ({
        id: item.id,
        firstName: item.firstName,
        lastName: item.lastName,
        gender: item.gender,
        bloodGroup: item.bloodGroup,
        email: item.email,
        phoneNumber: item.phone,
        city: item.address.city,
        university: item.university,
        img: item.image,
      }));
      setTableData(tdata);
      setTotalData(data.total);
    };
    loadData();
  }, [pagination, sorting, columnFilters]);

  useEffect(() => {
    const loadData = async () => {
      let data = await searchCandidateDetails(globalFilter);
      let tdata = data.users.map((item) => ({
        id: item.id,
        firstName: item.firstName,
        lastName: item.lastName,
        gender: item.gender,
        bloodGroup: item.bloodGroup,
        email: item.email,
        phoneNumber: item.phone,
        city: item.address.city,
        university: item.university,
        img: item.image,
      }));
      setTableData(tdata);
      setTotalData(data.total);
    };
    loadData();
  }, [globalFilter]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => `${row.firstName}`, //accessorFn used to join multiple data into a single cell
        id: "firstName", //id is still required when using accessorFn instead of accessorKey
        header: "FirstName",
        size: 250,
        enableColumnFilterModes: true,
        Cell: ({ renderedCellValue, row }) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <img
              alt="avatar"
              height={30}
              src={row.original.img}
              loading="lazy"
              style={{ borderRadius: "50%" }}
            />
            {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
            <span>{renderedCellValue}</span>
          </Box>
        ),
      },

      {
        accessorKey: "lastName",
        header: "Last Name",
        // size: 150,
      },
      {
        accessorKey: "gender", //normal accessorKey
        header: "Gender",
        // size: 200,
      },
      {
        accessorKey: "bloodGroup",
        header: "Blood Group",
        enableColumnFilterModes: false,
        // size: 150,
      },
      {
        accessorKey: "email",
        header: "Email",
        enableColumnFilterModes: false,
        // size: 150,
      },
      {
        accessorKey: "phoneNumber",
        header: "Phone Number",
        enableColumnFilterModes: false,
        // size: 150,
      },
      {
        accessorKey: "city",
        header: "City",
        enableColumnFilterModes: false,
        // size: 150,
      },
      {
        accessorKey: "university",
        header: "University",
        // size: 150,
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: tabledata,
    enableRowActions: true,
    enableRowSelection: true,
    enableSelectAll: false,
    paginationDisplayMode: "pages",
    rowCount: totalData,
    positionToolbarAlertBanner: "bottom",
    manualSorting: true,
    getRowId: (row) => row.id,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    manualFiltering: true, //turn off client-side filtering
    onColumnFiltersChange: setColumnFilters, //hoist internal columnFilters state to your state
    initialState: {
      columnPinning: {
        left: ["mrt-row-expand", "mrt-row-select"],
        right: ["mrt-row-actions"],
      },
      rowSelection: rowSelection,
    },
    manualPagination: true,
    onPaginationChange: setPagination,
    state: { rowSelection, pagination, globalFilter, sorting, columnFilters },
    onSortingChange: setSorting,
    muiPaginationProps: {
      color: "secondary",
      rowsPerPageOptions: [5, 10, 15],
      shape: "rounded",
      variant: "outlined",
    },
    renderRowActionMenuItems: ({ closeMenu, row }) => [
      <MenuItem
        key={0}
        onClick={() => {
          closeMenu();
          handleOpen();
          setSelectedCandidate(row.original);
        }}
        sx={{ m: 0 }}
      >
        Details
      </MenuItem>,
    ],
  });

  return (
    <div>
      {tabledata !== null ? (
        <>
          <MaterialReactTable table={table} />
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            {open ? (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "white",
                  boxShadow: 24,
                  borderRadius: 4,
                }}
              >
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <h2
                    style={{ textDecoration: "underline" }}
                    id="parent-modal-title"
                  >
                    {" "}
                    Candidate Details{" "}
                  </h2>
                  <Card style={{ padding: "2vw" }}>
                    <CardContent
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <img
                        alt="avatar"
                        height={250}
                        src={selectedCandidate?.img}
                        loading="lazy"
                        style={{ borderRadius: "50%", float: "left" }}
                      />
                      <div>
                        <Typography gutterBottom variant="h5" component="div">
                          {selectedCandidate.firstName +
                            " " +
                            selectedCandidate.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <b>Gender:</b> {selectedCandidate.gender}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <b>Blood Group:</b> {selectedCandidate.bloodGroup}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          <b>Email:</b> {selectedCandidate.email}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <b>Phone Number:</b> {selectedCandidate.phoneNumber}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <b>City:</b> {selectedCandidate.city}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <b>University:</b> {selectedCandidate.university}
                        </Typography>
                      </div>
                    </CardContent>
                    <CardActions style={{ justifyContent: "flex-end" }}>
                      <Button onClick={() => handleClose()} size="small">
                        Close
                      </Button>
                      <Button
                        size="small"
                        onClick={() => {
                          setRowSelection({
                            ...rowSelection,
                            [selectedCandidate.id]: true,
                          });
                          // addCandidate(selectedCandidate);
                          handleClose();
                        }}
                      >
                        Shortlist
                      </Button>
                    </CardActions>
                  </Card>
                </Box>
              </div>
            ) : (
              <></>
            )}
          </Modal>{" "}
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Candidates;
