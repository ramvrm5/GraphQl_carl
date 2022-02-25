import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Tooltip } from '@material-ui/core';
import Pagination from '@mui/material/Pagination';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import './productTable.css';

const useStylesSelect = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));



function ProductTable() {
    const classes = useStylesSelect();
    const [productType, setProductType] = useState();
    const [investment, setInvestment] = useState();
    const [searchValue, setSearchValue] = useState("");
    const [tableDataLength, setTableDataLength] = useState(10);
    const [factorMin, setFactorMin] = useState(0);
    const [factorMax, setFactorMax] = useState(100);
    const [limit, setLimit] = useState(30);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [showPagination, setShowPagination] = useState(true);
    const [skip, setSkip] = useState(0);
    const [referenceInstruments, setReferenceInstruments] = useState([]);
    const [rIValue, setRIValue] = useState("");
    const [RIinputValue, setRIInputValue] = useState('');
    const [tableData, setTableData] = useState([]);
    const [tableDataTemp, setTableDataTemp] = useState([]);
    const [factorRange, setFactorRange] = useState([factorMin, factorMax]);
    const [open, setOpen] = React.useState(false);


    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        setOpen(true);
        let requestBody = {
            query: `
              query {
                events(factorMin: "${factorMin}", factorMax: "${factorMax}", productType: "${productType}", referenceInstrument: "${rIValue?.label}", limit: "${limit}", skip: "${skip}") {
                    _id
                    reference_instrument
                    symbol
                    type
                    factor
                    bid
                    ask
                    product_type
                    barrier
                    investment_class
                    count
                }
              }
            `
        };

        const unsubscribe = fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                setOpen(false);
                throw new Error('Failed!');
            }
            return res.json();
        })
            .then(resData => {
                let calculatePage = Math.ceil(resData.data?.events[0]?.count / limit);
                setPageCount(calculatePage)
                setTableData(resData.data.events)
                setTableDataTemp(resData.data.events);
                getInvestmentClassData()
                setOpen(false);
            })
            .catch(err => {
                setOpen(false);
                console.log(err);
            });

        return unsubscribe;
    }, [])

    const getInvestmentClassData = (event) => {
        let requestBody = {
            query: `
              query {
                invest {
                    investment_class
                    label
                }
              }
            `
        };

        const unsubscribe = fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                setOpen(false);
                throw new Error('Failed!');
            }
            return res.json();
        })
            .then(resData => {
                setReferenceInstruments(resData.data.invest);
                //setRIValue(resData.data.invest[0]);
            })
            .catch(err => {
                setOpen(false);
                console.log(err);
            });
    };

    const handleChangeProductType = (event) => {
        setProductType(event.target.value);
    };

    const handleChangeTableDataLength = (event) => {
        setOpen(true);
        setLimit(event.target.value)
        setTableDataLength(event.target.value);
        let requestBody = {
            query: `
              query {
                events(factorMin: "${factorMin}", factorMax: "${factorMax}", productType: "${productType}", referenceInstrument: "${rIValue?.label}", limit: "${event.target.value}", skip: "${skip}") {
                    _id
                    reference_instrument
                    symbol
                    type
                    factor
                    bid
                    ask
                    product_type
                    barrier
                    investment_class
                    count
                }
              }
            `
        };

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                setOpen(false);
                throw new Error('Failed!');
            }
            return res.json();
        })
            .then(resData => {
                let calculatePage = Math.ceil(resData.data?.events[0]?.count / limit);
                console.log(calculatePage)
                setPageCount(calculatePage)
                setTableData(resData.data.events);
                setTableDataTemp(resData.data.events);
                setOpen(false);
            })
            .catch(err => {
                setOpen(false);
                console.log(err);
            });

    };

    const handleChangeInvestment = (value) => {
        //setInvestment(event.target.value);
        setRIValue(value);
    };

    const handleFactorMinMax = (value, type) => {
        if (type === "min") {
            setFactorMin(value);
            setFactorRange([value, factorMax]);
        } else {
            setFactorMax(value);
            setFactorRange([factorMin, value]);
        }
    };

    const handleChangefactor = (event, newValue) => {
        setFactorMin(newValue[0]);
        setFactorMax(newValue[1]);
        setFactorRange(newValue);
    };

    const handleChangeApllyFilter = () => {
        setSearchValue("");
        setOpen(true);
        let requestBody = {
            query: `
              query {
                events(factorMin: "${factorMin}", factorMax: "${factorMax}", productType: "${productType}", referenceInstrument: "${rIValue?.label}", limit: "${limit}", skip: "${skip}") {
                    _id
                    reference_instrument
                    symbol
                    type
                    factor
                    bid
                    ask
                    product_type
                    barrier
                    investment_class
                    count
                }
              }
            `
        };

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                setOpen(false);
                throw new Error('Failed!');
            }
            return res.json();
        })
            .then(resData => {
                let calculatePage = Math.ceil(resData.data?.events[0]?.count / limit);
                setPageCount(calculatePage)
                setTableData(resData.data.events);
                setTableDataTemp(resData.data.events);
                setOpen(false);
            })
            .catch(err => {
                setOpen(false);
                console.log(err);
            });
    };

    const handleCSearchData = () => {
        setOpen(true);
        //let searchValue = searchValue.trim();
        let filteredData = tableDataTemp.filter(value => {
            return (
                value.barrier.toLowerCase().includes(searchValue.trim().toLowerCase()) ||
                value.product_type.toLowerCase().includes(searchValue.trim().toLowerCase()) ||
                value.reference_instrument.toString().toLowerCase().includes(searchValue.trim().toLowerCase()) ||
                value.symbol.toString().toLowerCase().includes(searchValue.trim().toLowerCase()) ||
                value.type.toString().toLowerCase().includes(searchValue.trim().toLowerCase()) ||
                value.factor === parseInt(searchValue.trim())
            );
        });
        if (searchValue) {
            setShowPagination(false);
        } else {
            setShowPagination(true);
        }
        setTableData(filteredData)
        setOpen(false);

    }

    const handleChange = (event, value) => {
        setOpen(true);
        let skipCalculate;
        if (value > page) {
            skipCalculate = (value - 1) * limit;
        } else {
            skipCalculate = (value - 1) * limit;
        }
        setSkip(skipCalculate);
        setPage(value);
        let requestBody = {
            query: `
              query {
                events(factorMin: "${factorMin}", factorMax: "${factorMax}", productType: "${productType}", referenceInstrument: "${rIValue?.label}", limit: "${limit}", skip: "${skipCalculate}") {
                    _id
                    reference_instrument
                    symbol
                    type
                    factor
                    bid
                    ask
                    product_type
                    barrier
                    investment_class
                    count
                }
              }
            `
        };

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                setOpen(false);
                throw new Error('Failed!');
            }
            return res.json();
        })
            .then(resData => {
                let calculatePage = Math.ceil(resData.data?.events[0]?.count / limit);
                setPageCount(calculatePage)
                setTableData(resData.data.events)
                setTableDataTemp(resData.data.events);
                setOpen(false);
            })
            .catch(err => {
                setOpen(false);
                console.log(err);
            });
    };

    return (
        <div className="row mainContainer">
            <div className="mainColumn col-lg-8 col-md-10 col-sm-11 col-xs-11">
                <div className="row mt-5">
                    <div className="col-8">
                        <input className="form-control" placeholder="Search...." value={searchValue} onChange={(event) => setSearchValue(event.target.value)} />
                    </div>
                    <div className="col-1 search">
                        <Tooltip title="Search">
                            <button type="button" className="btn btn-secondary" onClick={handleCSearchData}><i className="fa fa-search" aria-hidden="true"></i></button>
                        </Tooltip>
                    </div>
                    <div className="col-1 filter">
                        <Tooltip title="Filter">
                            <button type="button" className="btn btn-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFilterOptions" aria-expanded="false" aria-controls="collapseFilterOptions"><i className="fa fa-filter" aria-hidden="true"></i></button>
                        </Tooltip>
                    </div>
                </div>
                <div className="collapse row mt-2 border border-secondary" id="collapseFilterOptions">
                    <div className="col-12">
                        <div className="row mt-3 mb-3">
                            {/* <div className="col-4 mx-auto selectPT">
                                <FormControl className={classes.formControl}>
                                    <InputLabel id="product_type">Product Type</InputLabel>
                                    <Select
                                        labelId="product_type"
                                        id="product_type"
                                        value={productType}
                                        onChange={handleChangeProductType}
                                    >
                                        <MenuItem value={10}>Ten</MenuItem>
                                        <MenuItem value={20}>Twenty</MenuItem>
                                        <MenuItem value={30}>Thirty</MenuItem>
                                    </Select>
                                </FormControl>
                            </div> */}
                            <div className="col-4 mx-auto selectI">
                                <Autocomplete
                                    value={rIValue}
                                    onChange={(event, newValue) => {
                                        handleChangeInvestment(newValue)
                                    }}
                                    inputValue={RIinputValue}
                                    onInputChange={(event, newInputValue) => {
                                        setRIInputValue(newInputValue);
                                    }}
                                    id="referenceInstruments"
                                    options={referenceInstruments}
                                    sx={{ width: 380 }}
                                    renderInput={(params) => <TextField {...params} label="Reference Instruments" />}
                                />
                                {/* <FormControl className={classes.formControl}>
                                    <InputLabel id="product_type">Reference Instruments</InputLabel>
                                    <Select
                                        labelId="product_type"
                                        id="product_type"
                                        value={investment}
                                        onChange={handleChangeInvestment}
                                    >
                                        {referenceInstruments.map(({ investment_class }, i) => {
                                            return (
                                                <MenuItem value={investment_class} key={i}>{investment_class}</MenuItem>
                                            )
                                        })
                                        }
                                    </Select>
                                </FormControl> */}
                            </div>
                        </div>
                        <div className="row mt-4 mb-4">
                            <div className="col-10 mx-auto">
                                <Typography id="range-slider" gutterBottom>
                                    Factor range
                                </Typography>
                                <div className="factor_range">
                                    <input type="number" className="form-control w-25" placeholder="Min" value={factorMin} onChange={(event) => handleFactorMinMax(event.target.value, "min")} />
                                    <Slider
                                        value={factorRange}
                                        onChange={handleChangefactor}
                                        valueLabelDisplay="auto"
                                        aria-labelledby="range-slider"
                                    />
                                    <input type="number" className="form-control w-25" placeholder="Max" value={factorMax} onChange={(event) => handleFactorMinMax(event.target.value, "max")} />
                                </div>
                            </div>
                        </div>
                        <div className="row mt-4 mb-4 ">
                            <div className="col-12 applyButton">
                                <button type="button" className="btn btn-secondary" onClick={handleChangeApllyFilter} >Apply filter</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="tableContent row mt-5">
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={open}
                        onClick={handleClose}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                    <div className="col-12">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">S.no</th>
                                    <th scope="col">reference_instrument</th>
                                    <th scope="col">symbol</th>
                                    <th scope="col">product_type</th>
                                    <th scope="col">type</th>
                                    <th scope="col">factor</th>
                                    <th scope="col">bid</th>
                                    <th scope="col">ask</th>
                                    <th scope="col">barrier</th>
                                </tr>
                            </thead>
                            {tableData.length > 0 ? <tbody>
                                {
                                    tableData.map((object, i) => {
                                        return (
                                            <tr key={i}>
                                                <td>{skip + (i + 1)}</td>
                                                <td>{object?.reference_instrument}</td>
                                                <td>{object?.symbol}</td>
                                                <td>{object?.product_type}</td>
                                                <td>{object?.type}</td>
                                                <td>{object?.factor}</td>
                                                <td>{object?.bid}</td>
                                                <td>{object?.ask}</td>
                                                <td>{object?.barrier}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody> :
                                <tbody>
                                    <tr>
                                        <td colSpan="9" className="text-center">No data to show</td>
                                    </tr>
                                </tbody>}
                        </table>
                    </div>
                </div>
                {showPagination && (<div className="row mt-4 mb-4 border border-secondary">
                    {/* <div className="col-4 TableDataLength">
                        <FormControl className={classes.formControl}>
                            <InputLabel id="product_type">Data per page</InputLabel>
                            <Select
                                labelId="product_type"
                                id="product_type"
                                value={tableDataLength}
                                onChange={handleChangeTableDataLength}
                            >
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={25}>25</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                            </Select>
                        </FormControl>
                    </div> */}
                    <div className="col-8 pagination">
                        <Pagination count={pageCount} page={page} variant="outlined" shape="rounded" onChange={handleChange} />
                    </div>
                </div>)}
            </div>
        </div>
    )
}

export default ProductTable
