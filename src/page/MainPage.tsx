import React from 'react'
import AppTablePagination from '../components/AppTablePagination';
import useTablePage from '../util/TablePage';
import { PageResponse, PaginationRequest, PaginationType } from '../model/Pagination';
import AppTable from '../components/AppTable';
import { FormControl, Grid, InputLabel, MenuItem, Select, SortDirection, TextField, Typography } from '@material-ui/core';
import { Box } from '@material-ui/system';
import { Cell } from '../model/Table';
import api from '../api';
import { useEffect, useState } from 'react';
import AppPieChart from '../components/AppPieChart';
import { ChartData } from '../components/AppPieChart';
import { Filter } from '@material-ui/icons';

interface Form extends PaginationRequest {
    gender: string | undefined;
    race: string | undefined;
    ethnicity: string | undefined;
    orderBy: string | undefined;
    order: SortDirection;
    death: string | undefined;
    age_min: number;
    age_max: number;
}

interface Param {
    gender?: string | undefined;
    order_column?: string | undefined;
    order_desc?: string | undefined;
    race?: string | undefined;
    ethnicity?: string | undefined;
    age_min: number;
    age_max: number;
    death?: string | undefined;
}

interface PageParam extends PaginationType, Param {

}

interface PatientResponse {
    personID: number;
    age: number;
    birthDatetime: string;
    ethnicity: string;
    gender: string;
    isDeath: string;
    race: string;
}

const CELLS: Cell[] = [
    {
        id: 'person_id',
        label: '아이디',
        width: 20
    },
    {
        id: 'gender',
        label: '성별',
        width: 10
    },
    {
        id: 'birth',
        label: '생년월일',
        width: 20
    },
    {
        id: 'age',
        label: '나이',
        width: 10
    },
    {
        id: 'race',
        label: '인종',
        width: 20
    },
    {
        id: 'ethnicity',
        label: '민족',
        width: 10
    },
    {
        id: 'isDeath',
        label: '사망 여부',
        width: 10
    }
]

interface GenderResponse {
    genderList: string[]
}

interface RaceResponse {
    raceList: string[]
}

interface EthnicityResponse {
    ethnicityList: string[]
}


interface StatResponse {
    stats: Stat[]
}

interface Stat {
    count: number;
    ethnicity: string;
    gender: string;
    race: string;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


export default function MainPage() {

    const [genders, setGenders] = useState<string[]>([]);
    const [races, setRaces] = useState<string[]>([]);
    const [ethnicity, setEthnicity] = useState<string[]>([]);
    const [stats, setStats] = useState<Stat[]>([]);
    const [genderPie, setGenderPie] = useState<ChartData[]>([]);
    const [gePie, setGePie] = useState<ChartData[]>([]);
    const [grPie, setGrPie] = useState<ChartData[]>([]);
    const [racePie, setRacePie] = useState<ChartData[]>([]);
    const [ethnicityPie, setEthnicityPie] = useState<ChartData[]>([]);

    const getRows = async (form: Form) => {
        try {
            const res = await api.get<PageResponse<PatientResponse>>('/api/patient/list', {
                params: {
                    page: form.page,
                    length: form.length,
                    gender: form.gender,
                    race: form.race,
                    order_column: form.orderBy,
                    order_desc: form.order === 'desc',
                    ethnicity: form.ethnicity,
                    death: form.death,
                    age_min: form.age_min,
                    age_max: form.age_max,
                }
            });
            return res.data;
        } catch (error) {
            alert('에러 발생')
        }

    }

    const tablePage = useTablePage<Form, PageParam, PatientResponse, Param>(
        {
            cells: CELLS,
            rowsPerPage: 10,
            convertRowToTable: (it: PatientResponse) => {
                return {
                    id: it.personID + '',
                    data: [
                        it.personID + '',
                        it.gender,
                        it.birthDatetime,
                        it.age + '',
                        it.race,
                        it.ethnicity,
                        it.isDeath + ''
                    ]
                }
            },
            convertParamToForm: (p: PageParam) => {
                return {
                    page: parseInt(p.page),
                    length: parseInt(p.length),
                    gender: p.gender,
                    race: p.race,
                    ethnicity: p.ethnicity,
                    order: p.order_desc === 'false' ? 'desc' : 'asc',
                    orderBy: p.order_column,
                    death: p.death,
                    age_max: p.age_max,
                    age_min: p.age_min
                }
            },
            initialValue: {
                page: 1,
                length: 10,
                gender: undefined,
                race: undefined,
                order: 'asc',
                orderBy: undefined,
                ethnicity: undefined,
                death: undefined,
                age_min: 0,
                age_max: 100
            },
            getRows: getRows
        }
    )

    useEffect(() => {
        getGenders();
        getRaces();
        getEthnicities();
        getStats();
    }, []);

    useEffect(() => {
        generatePie(tablePage.viewForm)
    }, [tablePage.viewForm, genders, races, ethnicity, stats]);

    const getStats = async () => {
        try {
            const res = await api.get<StatResponse>('/api/patient/stats');
            setStats(res.data.stats)
        } catch (error) {
            alert('에러 발생')
        }
    }

    const generatePie = (form: Form) => {
        setGenderPie(
            genders.filter(it => form.gender ? form.gender === it : true)
                .map(it => {
                    return {
                        title: it,
                        value: stats.filter(s => s.gender === it).reduce((accum, next) => {
                            return accum + next.count;
                        }, 0),
                        color: getRandomColor()
                    }
                }));
        setRacePie(
            races.filter(it => form.race ? form.race === it : true)
                .map(it => {
                    return {
                        title: it,
                        value: stats.filter(s => s.race === it).reduce((accum, next) => {
                            return accum + next.count;
                        }, 0),
                        color: getRandomColor()
                    }
                }));
        setEthnicityPie(
            ethnicity.filter(it => form.ethnicity ? form.ethnicity === it : true)
                .map(it => {
                    return {
                        title: it,
                        value: stats.filter(s => s.ethnicity === it).reduce((accum, next) => {
                            return accum + next.count;
                        }, 0),
                        color: getRandomColor()
                    }
                }));

        const gr: string[][] = [];
        genders.forEach(it => {
            races.forEach(r => {
                gr.push([it, r]);
            })
        })
        setGrPie(gr.filter(g => form.gender ? form.gender === g[0] : true)
            .filter(g => form.race ? form.race === g[1] : true)
            .map(it => {
                return {
                    title: `${it[0]}   ${it[1]}`,
                    value: stats.filter(s => s.gender === it[0])
                        .filter(s => s.race === it[1])
                        .reduce((accum, next) => {
                            return accum + next.count;
                        }, 0),
                    color: getRandomColor()
                }
            })
        )

        const ge: string[][] = [];
        genders.forEach(it => {
            ethnicity.forEach(r => {
                ge.push([it, r]);
            })
        })
        setGePie(ge.filter(g => form.gender ? form.gender === g[0] : true)
            .filter(g => form.ethnicity ? form.ethnicity === g[1] : true)
            .map(it => {
                return {
                    title: `${it[0]}   ${it[1]}`,
                    value: stats.filter(s => s.gender === it[0])
                        .filter(s => s.ethnicity === it[1])
                        .reduce((accum, next) => {
                            return accum + next.count;
                        }, 0),
                    color: getRandomColor()
                }
            })
        )
    }

    const getGenders = async () => {
        try {
            const res = await api.get<GenderResponse>('/api/gender/list');
            setGenders(res.data.genderList);
        } catch (error) {
            alert('에러 발생');
        }
    }

    const getRaces = async () => {
        try {
            const res = await api.get<RaceResponse>('/api/race/list');
            setRaces(res.data.raceList);
        } catch (error) {
            alert('에러 발생');
        }
    }

    const getEthnicities = async () => {
        try {
            const res = await api.get<EthnicityResponse>('/api/ethnicity/list');
            setEthnicity(res.data.ethnicityList);
        } catch (error) {
            alert('에러 발생');
        }
    }

    return (
        <>
            {tablePage &&

                <Box p={20}>
                    <Grid container>
                        <Grid item sm={6}>
                            <AppPieChart
                                title={'성별 환자 수'}
                                data={genderPie}
                            />
                        </Grid>
                        <Grid item sm={6}>
                            <AppPieChart
                                title={'인종별 환자 수'}
                                data={racePie}
                            />
                        </Grid>
                        <Grid item sm={6}>
                            <AppPieChart
                                title={'민족별 환자 수'}
                                data={ethnicityPie}
                            />
                        </Grid>
                        <Grid item sm={6}>
                            <AppPieChart
                                title={'성별 + 인종별 환자 수'}
                                data={grPie}
                            />
                        </Grid>
                        <Grid item sm={6}>
                            <AppPieChart
                                title={'성별 + 민족별 환자 수'}
                                data={gePie}
                            />
                        </Grid>

                        <Grid item sm={12}>

                            <Typography>환자 리스트</Typography>
                            <AppTable
                                orderBy={tablePage.viewForm.orderBy}
                                order={tablePage.viewForm.order}
                                onRowsPerPageChange={tablePage.onRowsPerPageChange}
                                onRequestSort={(id) => {
                                    let o = '';
                                    if (tablePage.viewForm.orderBy === id) {
                                        o = tablePage.viewForm.order === 'asc' ? 'desc' : 'asc';
                                    } else {
                                        o = 'asc';
                                    }
                                    tablePage.searchRouting({
                                        ...tablePage.viewForm,
                                        order_column: id,
                                        order_desc: o === 'desc' ? 'false' : 'true'
                                    });

                                }}
                                onPageChange={tablePage.onPageMove}
                                pagination={tablePage.pagination}
                                onRowClick={(id: any) => {
                                }}
                                cells={CELLS}
                                data={tablePage.tableRow}>
                                {{
                                    buttonArea: (
                                        <>
                                        </>
                                    ),
                                    searchForm: (
                                        <>
                                            <Grid container>

                                                <Grid item
                                                    xs={2}>
                                                    {genders.length > 0 &&

                                                        <FormControl fullWidth>
                                                            <InputLabel>성별</InputLabel>
                                                            <Select
                                                                value={tablePage.viewForm.gender}
                                                                onChange={(v) => {
                                                                    tablePage.searchRouting({
                                                                        ...tablePage.viewForm,
                                                                        gender: v.target.value
                                                                    });
                                                                }}
                                                            >
                                                                <MenuItem value={undefined}>전체</MenuItem>
                                                                {genders.map(it => <MenuItem value={it}>{it}</MenuItem>)}
                                                            </Select>
                                                        </FormControl>
                                                    }
                                                </Grid>

                                                <Grid item
                                                    xs={2}>
                                                    {races.length > 0 &&
                                                        <FormControl fullWidth>
                                                            <InputLabel >인종</InputLabel>
                                                            <Select
                                                                value={tablePage.viewForm.race}
                                                                onChange={(v) => {
                                                                    tablePage.searchRouting({
                                                                        ...tablePage.viewForm,
                                                                        race: v.target.value
                                                                    });
                                                                }}
                                                            >
                                                                <MenuItem value={undefined}>전체</MenuItem>
                                                                {races.map(it => <MenuItem value={it}>{it}</MenuItem>)}
                                                            </Select>
                                                        </FormControl>
                                                    }
                                                </Grid>
                                                <Grid item
                                                    xs={2}>
                                                    {ethnicity.length > 0 &&
                                                        <FormControl fullWidth>
                                                            <InputLabel >민족</InputLabel>
                                                            <Select
                                                                value={tablePage.viewForm.ethnicity}
                                                                onChange={(v) => {
                                                                    tablePage.searchRouting({
                                                                        ...tablePage.viewForm,
                                                                        ethnicity: v.target.value
                                                                    });
                                                                }}
                                                            >
                                                                <MenuItem value={undefined}>전체</MenuItem>
                                                                {ethnicity.map(it => <MenuItem value={it}>{it}</MenuItem>)}
                                                            </Select>
                                                        </FormControl>
                                                    }
                                                </Grid>
                                                <Grid item
                                                    xs={2}>
                                                    {ethnicity.length > 0 &&

                                                        <FormControl fullWidth>
                                                            <InputLabel >사망여부</InputLabel>
                                                            <Select
                                                                value={tablePage.viewForm.death}
                                                                onChange={(v) => {
                                                                    tablePage.searchRouting({
                                                                        ...tablePage.viewForm,
                                                                        death: v.target.value
                                                                    });
                                                                }}
                                                            >

                                                                <MenuItem value={undefined}>전체</MenuItem>
                                                                <MenuItem value={'true'}>true</MenuItem>
                                                                <MenuItem value={'false'}>false</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    }
                                                </Grid>
                                                <Grid item
                                                    xs={2}>
                                                    <FormControl fullWidth>
                                                        <TextField
                                                            value={tablePage.viewForm?.age_min}
                                                            onChange={(v) => {
                                                                tablePage.searchRouting({
                                                                    ...tablePage.viewForm,
                                                                    age_min: parseInt(v.target.value)
                                                                });
                                                            }}
                                                            id="standard-basic" label="최소 나이" />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item
                                                    xs={2}>
                                                    <FormControl fullWidth>
                                                        <TextField
                                                            value={tablePage.viewForm?.age_max}
                                                            onChange={(v) => {
                                                                tablePage.searchRouting({
                                                                    ...tablePage.viewForm,
                                                                    age_max: parseInt(v.target.value)
                                                                });
                                                            }}
                                                            label="최대 나이" />
                                                    </FormControl>
                                                </Grid>
                                            </Grid>

                                        </>
                                    )
                                }}
                            </AppTable>
                        </Grid>
                    </Grid>
                </Box>
            }

        </>

    )
}
