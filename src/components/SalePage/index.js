import React, {Component} from 'react'
import api from '../../services/api';
import {getStringDate, getStringFloat} from '../../rules';

import {SyncLoader} from 'react-spinners'
import {Title, NoConnection, Loader} from '../../styles/styles';
import {Profile} from '../../styles/pageStyles';
import {TableHeader, TableLayout} from '../../styles/tableStyles';
import TableContent from './TableContent';


export default class ProductPage extends Component{
    //State
    state = {
        sale: {},
        connection: true,
        loading: true,
        clientName: "",
    }

    async componentDidMount(){
        const { match: { params } } = this.props;
        try{
            //Get Sale Data
            const sale = await api.get(`/sales/${params.id}`);
            //Get Client Name
            const client = await api.get(`/clients/${sale.data.clientId}`);
            this.setState({loading: false, sale: sale.data, clientName: client.data.name});
        } catch (e){
            this.setState({loading: false, connection: false});
        }
    }

    //Get total sale price
    getPrice = sale => {
        let price = 0;
        sale.products.map(prod => {
            price += prod.price * prod.amount;
        })

        return getStringFloat(price);
    }

    //Get total amount of products
    getAmount = sale => {
        let amount = 0;
        sale.products.map(prod => {
            amount += prod.amount;
        })

        return amount;
    }

    render(){
        const {sale, loading, connection, clientName} = this.state;

        return(
            <section>
                {/* While loading  */}
                {loading && (<Loader><SyncLoader/></Loader>)}

                {/* Connection error */}
                {!connection && (<NoConnection/>)}

                {/* If not loading and connected */}
                {(!loading && connection) && (
                    <div>
                    {/* Render profile  */}
                    <Profile>    
                        <div className="stats">
                            <span>
                                <strong>Id: </strong>{sale._id}
                            </span>
                            <span>
                                <strong>Total: </strong>{this.getPrice(sale)}
                            </span>
                            <span>
                                <strong>Registro: </strong>{getStringDate(sale.createdAt)}
                            </span>
                            <span>
                                <strong>Produtos: </strong>{this.getAmount(sale)}
                            </span>
                            <span>
                                <strong>Cliente: </strong>{clientName}
                            </span>
                        </div>
                    </Profile>
         
                    {/* Line */}
                    <hr 
                    style={{
                        border:'none',
                        borderBottom: '1px solid lightgray',
                        margin: '24px 0'
                    }}/>
                    
                    {/* Products table */}
                    <Title>Produtos</Title>
                    <TableLayout>
                        <thead>
                            <tr>
                                <TableHeader>Nome</TableHeader>
                                <TableHeader>Sugerido</TableHeader>
                                <TableHeader>Preço</TableHeader>
                                <TableHeader>Quantidade</TableHeader>
                                <TableHeader>Rentabilidade</TableHeader>
                            </tr>
                        </thead>
                        {/* Table Content */}
                        <TableContent products={sale.products}/>
                    </TableLayout>
                 </div>
                )}
            </section>
        );
    }
}
