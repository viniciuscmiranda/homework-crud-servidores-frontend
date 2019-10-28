import React, {Component} from 'react';
import api from '../../services/api';
import {SyncLoader} from 'react-spinners'
import {Link} from 'react-router-dom';
import {TableLayout, TableHeader, TableContainer} from '../../styles/tableStyles';
import {Title, NewButton, NoConnection, Loader} from '../../styles/styles';
import TableContent from './TableContent';


export default class ClientList extends Component {
    // State
    state = {
        clientsFromDatabase: [],
        loading: true,
        connection: false
    };

    async componentDidMount() {
        try {
            // Get clients from server
            const data = await api.get('/getClients.php');
            let clis = data.data;
            clis.map(c=>c);

            this.setState({clientsFromDatabase: clis, loading: false, connection: true});
        } catch {
            this.setState({loading: false, connection: false});
        }
    };

    //Delete client from database
    deleteClientHandler = async id => {
        api.get(`/deleteClient.php?id=${id}`);
        //Remove from table
        const item = document.getElementById(id);
        item.parentNode.removeChild(item);
    }

    render() {
        const {clientsFromDatabase, loading, connection} = this.state;

        return (
            <section>
                <Title>Clientes</Title>

                {/* Connection Error */}
                {!connection && !loading && (<NoConnection/>)}
                
                {/* While Loading */}
                {loading && (<Loader><SyncLoader/></Loader>)}

                {/* If connected and not Loading */}
                {(connection && !loading) && (
                    // Render Table
                    <TableContainer>
                    <TableLayout>
                        <table>
                            <thead>
                                <tr>
                                    <TableHeader>Nome</TableHeader>
                                    <TableHeader>Registro</TableHeader>
                                    <TableHeader>Ações</TableHeader>
                                </tr>
                                <tr><th><br></br></th></tr>
                            </thead>
                            {/* Table Content */}
                            <TableContent clients={clientsFromDatabase} onDelete={this.deleteClientHandler}/>
                        </table>
                    </TableLayout>
                    </TableContainer>
                )}

                {/*  Go to new client */}
                <Link to="clients/new"><NewButton>Cadastrar Cliente</NewButton></Link>
            </section>
        );
    }
}
