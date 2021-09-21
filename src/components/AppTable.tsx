import {
    Card,
    CardContent,
    Grid,
    Paper,
    SortDirection,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
    TableSortLabel,
} from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import { ReactNode } from 'react';

import AppTablePagination from './AppTablePagination';
import { Pagination } from '../model/Pagination';
import { Cell, AppTableRowModel } from '../model/Table';


interface Prop {
    onRowClick: (id: string) => void;
    cells: Cell[];
    data: AppTableRowModel[];
    children: {
        searchForm?: ReactNode;
        buttonArea?: ReactNode;
    }
    pagination?: Pagination;
    onPageChange: (event: any, page: number) => void;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
    order: SortDirection;
    orderBy: string | undefined;
    onRequestSort: (id: string) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
    table: {
        minWidth: 650,
        tableLayout: 'fixed'
    },
    textContainer: {
        display: 'block',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    }
}));


export default function AppTable(prop: Prop) {

    const classes: any = useStyles;

    return (
        <>
            <Grid
                item
                md={12}
            >
                <Grid
                    container
                    spacing={2}>

                    {prop.children.buttonArea &&
                        <Grid
                            item
                            md={12}
                        >
                            {prop.children.buttonArea}
                        </Grid>
                    }

                    {prop.children.searchForm &&
                        <Grid
                            item
                            md={12}
                        >
                            <Card>
                                <CardContent>
                                    <Grid container
                                        direction={'row'}
                                        spacing={1}>
                                        {prop.children.searchForm}
                                    </Grid>
                                </CardContent>
                            </Card>

                        </Grid>
                    }
                    <Grid
                        item
                        md={12}
                    >
                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        {prop.cells.map((it, index) => (
                                            <TableCell
                                                sortDirection={prop.orderBy === it.id ? prop.order : false}
                                                style={{ width: it.width + '%' }}>
                                                {prop.order &&
                                                    <TableSortLabel
                                                        active={prop.orderBy === it.id}
                                                        direction={prop.orderBy === it.id ? prop.order : 'asc'}
                                                        onClick={() => {
                                                            prop.onRequestSort(it.id);
                                                        }}
                                                    >
                                                        {it.label}
                                                    </TableSortLabel>
                                                }
                                            </TableCell>
                                        ))}

                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {prop.data.map((row) => (
                                        <TableRow hover onClick={(it) => {
                                            prop.onRowClick(row.id)
                                        }} key={row.id + ''}>
                                            <TableCell className={classes.textContainer} component="th" scope="row">
                                                {row.data[0]}
                                            </TableCell>
                                            {row.data.map((it, index) => {
                                                if (index !== 0) {
                                                    return <TableCell className={classes.textContainer}>{it}</TableCell>
                                                }
                                            })}
                                        </TableRow>
                                    ))}
                                    {prop.data.length === 0 &&
                                        <TableRow>
                                            <TableCell colSpan={prop.cells.length} component="th" scope="row">내용이 없습니다.</TableCell>
                                        </TableRow>
                                    }
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        {prop.pagination &&
                                            <AppTablePagination
                                                {...prop.pagination}
                                                onRowsPerPageChange={prop.onRowsPerPageChange}
                                                onPageChange={prop.onPageChange}
                                            />
                                        }
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}
