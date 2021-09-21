// @ts-ignore
import { IconButton, TablePagination } from '@material-ui/core';
import { createStyles, useTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import React from 'react';


const useStyles = makeStyles((theme: any) =>
    createStyles({
        root: {
            flexShrink: 0,
            marginLeft: theme.spacing(2.5),
        },
    }),
);


// @ts-ignore
function TablePaginationActions(props) {
    const classes: any = useStyles;
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    // @ts-ignore
    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    // @ts-ignore
    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };
    // @ts-ignore
    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };
    // @ts-ignore
    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </div>
    );
}

interface Prop {
    page: number;
    rowsPerPage: number;
    count: number;
    colSpan: number;
    onPageChange: (event: any, page: number) => void
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
}

export default function AppTablePagination(prop: Prop) {

    // @ts-ignore
    return (<TablePagination
        ActionsComponent={TablePaginationActions}
        onPageChange={prop.onPageChange}
        colSpan={prop.colSpan}
        count={prop.count}
        rowsPerPage={prop.rowsPerPage}
        page={prop.page}
        onRowsPerPageChange={prop.onRowsPerPageChange}
        rowsPerPageOptions={[10, 20, 30]}
    />)
}