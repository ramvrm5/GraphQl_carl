import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';


// HEADER IMPORT
import Header from '../header';

// LOADING IMPORT
import Loading from '../Loading';

const productTable = lazy(() => import('../component/productTable/productTable'));

function router() {
    return (
        <Router>
            {/* <Header /> */}
            <Suspense fallback={<Loading />}>
                <Switch>
                    <Route exact path="/productTable" component={productTable} />
                    <Redirect from="*" to="/productTable" />
                </Switch>
            </Suspense>
        </Router>
    )
}

export default router
