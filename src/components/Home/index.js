import React, {Component} from 'react';
import api from '../../services/api';
import {Link} from 'react-router-dom';
import {SyncLoader} from 'react-spinners'
import {TableLayout, TableHeader} from '../../styles/tableStyles';
import {Title, NewButton, NoConnection, Loader} from '../../styles/styles';
import TableContent from './TableContent';

export default class Home extends Component {
    // State
    state = {
        salesFromDatabase: [],
        loading: true,
        connection: true
    };

    async componentDidMount() {
        // Get Sales from database
        try {
            const data = await api.get('/sales');
            const newData = await this.setClientNames(data.data);
            this.setState({salesFromDatabase: newData, loading: false, connection: true});
        } catch {
            this.setState({loading: false, connection: false});
        }
    };

    //Get client name from database
    setClientNames = async sales => {
        // If client match client id from sale, get name
        const prom = sales.map(async sale => {
            const c = await api.get(`/clients/${sale.clientId}`);
            if (c.data !== null) sale.clientName = c.data.name;
            else sale.clientName = "Not Found";
            }
        );

        await Promise.all(prom);
        return sales;
    }

    //Delete sale from database
    deleteSaleHandler = async id => {
        api.delete(`/sales/${id}`);
        // Remove from table
        const item = document.getElementById(id);
        item.parentNode.removeChild(item);
    }

    render() {
        const {salesFromDatabase, loading, connection} = this.state;

        return (
            <section>
                <Title>Vendas</Title>

                {/* Connection error */}
                {!connection && (<NoConnection/>)}

                {/* While loading */}
                {loading && (<Loader><SyncLoader/></Loader>)}

                {/* If connected and not loading */}
                {(connection && !loading) && (
                    // Render table
                    <TableLayout>
                        <thead>
                            <tr>
                                <TableHeader>Cliente</TableHeader>
                                <TableHeader>Valor</TableHeader>
                                <TableHeader>Data</TableHeader>
                                <TableHeader>Ações</TableHeader>
                            </tr>
                            <tr><th><br></br></th></tr>
                        </thead>

                        {/* Table content */}
                        <TableContent sales={salesFromDatabase} onDelete={this.deleteSaleHandler}/>
                    </TableLayout>
                )}

                {/* Go to new sale */}
                <Link to="sales/new"><NewButton>Cadastrar Venda</NewButton></Link>
            </section>
        );
    }
}
