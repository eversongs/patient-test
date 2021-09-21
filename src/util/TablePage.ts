import { PaginationRequest, PaginationType, Pagination, PageResponse } from '../model/Pagination';
import useRoutePage from './RoutePage';
import { useState, useEffect } from 'react';
import { AppTableRowModel, Cell } from '../model/Table';
import { useNavigate } from 'react-router';

interface TablePageProp<Form, PageParam, T> {
    cells: Cell[];
    rowsPerPage: number;
    initialValue: Form;
    convertRowToTable: (t: T) => AppTableRowModel;
    convertParamToForm: (p: PageParam) => Form;
    getRows: (f: Form) => Promise<PageResponse<T> | undefined>;
}


export default function useTablePage<Form extends PaginationRequest, PageParam extends PaginationType, T, Param>(
    prop: TablePageProp<Form, PageParam, T>
) {

    const [rows, setRows] = useState<T[]>([]);
    const [tableRow, setTableRows] = useState<AppTableRowModel[]>([]);
    const navigate = useNavigate();
    const [viewForm, setViewForm] = useState<Form>(prop.initialValue);
    const [form, setForm] = useState<Form>();
    const routePage = useRoutePage({ ...prop, setForm: setForm });
    const [pagination, setPagination] = useState<Pagination>({
        colSpan: prop.cells.length,
        count: 0,
        rowsPerPage: prop.rowsPerPage,
        page: 0,
    });


    useEffect(() => {
        if (form) {
            setViewForm({
                ...form
            });
            getRows(form);
        }
    }, [form]);

    useEffect(() => {
        setTableRows(rows.map(it => prop.convertRowToTable(it)));
    }, [rows]);

    const search = () => {
        routePage({
            ...viewForm,
            page: 0,
            size: prop.rowsPerPage
        });
    }

    const getRows = async (f: Form) => {
        if (prop.getRows) {
            const rows = await prop.getRows(f);
            if (rows) {
                setRows(rows.patient.list);
                setPagination({
                    ...pagination,
                    page: form!.page,
                    rowsPerPage: f.length,
                    count: rows.totalLength
                });
            }
        }
    }

    const refresh = () => {
        getRows(prop.initialValue);
    }

    const onPageMove = (event: any, page: number) => {
        routePage({
            ...viewForm,
            page: page,
            length: pagination.rowsPerPage
        });
    }

    const searchRouting = (p: Param) => {
        routePage({
            ...p,
            page: 1,
            length: pagination.rowsPerPage
        });
    }

    const onRowsPerPageChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        routePage({
            ...prop.initialValue,
            page: 1,
            length: event.target.value
        });
    }

    return { pagination, setPagination, searchRouting, search, refresh, viewForm, setViewForm, tableRow, onPageMove, navigate, onRowsPerPageChange }

}