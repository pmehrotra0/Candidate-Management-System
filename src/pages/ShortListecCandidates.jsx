import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { mkConfig, generateCsv, download } from "export-to-csv"; //or use your library of choice here
import { useMemo } from "react";
import { jsPDF } from "jspdf"; //or use your library of choice here
import autoTable from "jspdf-autotable";
import { useSelector } from "react-redux";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const ShortListedCandidates = () => {
  const { shortListedCandidates } = useSelector(
    (state) => state.shortListedCandidates
  );

  const columns = useMemo(
    () => [
      //   {
      //     accessorKey: 'firstName', //access nested data with dot notation
      //     header: 'First Name',
      //     // size: 150,
      //   },
      {
        accessorFn: (row) => `${row.firstName} ${row.lastName}`, //accessorFn used to join multiple data into a single cell
        id: "name", //id is still required when using accessorFn instead of accessorKey
        header: "Name",
        size: 250,
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

      //   {
      //     accessorKey: 'lastName',
      //     header: 'Last Name',
      //     // size: 150,
      //   },
      {
        accessorKey: "gender", //normal accessorKey
        header: "Gender",
        // size: 200,
      },
      {
        accessorKey: "bloodGroup",
        header: "Blood Group",
        // size: 150,
      },
      {
        accessorKey: "email",
        header: "Email",
        // size: 150,
      },
      {
        accessorKey: "phoneNumber",
        header: "Phone Number",
        // size: 150,
      },
      {
        accessorKey: "city",
        header: "City",
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

  // const handleExportRowsCSV = (rows) => {
  //   const rowData = rows.map((row) => row.original);
  //   const csv = generateCsv(csvConfig)(rowData);
  //   download(csvConfig)(csv);
  // };

  const handleExportRowsCSV = () => {
    const csv = generateCsv(csvConfig)(shortListedCandidates);
    download(csvConfig)(csv);
  };

  const handleExportRowsPDF = (rows) => {
    const doc = new jsPDF("l", "mm", "a4");
    const tableData = rows.map((row) => Object.values(row.original));
    const tableHeaders = [
      "id",
      "First Name",
      "Last Name",
      "Gender",
      "Blood Group",
      "Email",
      "Phone Number",
      "City",
      "University",
      "Image URL",
    ];
    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
    });

    doc.save("mrt-pdf-example.pdf");
  };

  const table = useMaterialReactTable({
    columns,
    data: shortListedCandidates,
    //   enableRowSelection: true,
    columnFilterDisplayMode: "popover",
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          padding: "8px",
          flexWrap: "wrap",
        }}
      >
        <Button
          //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
          onClick={handleExportRowsCSV}
          startIcon={<FileDownloadIcon />}
        >
          Export To CSV
        </Button>
        <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          //export all rows, including from the next page, (still respects filtering and sorting)
          onClick={() =>
            handleExportRowsPDF(table.getPrePaginationRowModel().rows)
          }
          startIcon={<FileDownloadIcon />}
        >
          Export To PDF
        </Button>
      </Box>
    ),
  });

  return (
    <>
      {shortListedCandidates.length === 0 ? (
        <div> No candidate found</div>
      ) : (
        <MaterialReactTable table={table} />
      )}
    </>
  );
};

export default ShortListedCandidates;
