import React, {Component} from 'react';
import { Main } from './styles';
import {MdFace, MdList, MdShoppingCart} from 'react-icons/md'
import {Link} from 'react-router-dom';
import {NoConnection, Loader} from '../../styles/styles';
import api from '../../services/api';
import {SyncLoader} from 'react-spinners';


export default class Home extends Component{
    state = {
        cli: "",
        prod: "",
        sale: "",

        loading: true,
        connection: true
    }
    
    async componentDidMount() {
        try{
            let cli = await api.get('/getClients.php');            
            let prod = await api.get('/getProducts.php');
            let sale = await api.get('/getSales.php');   
            
            try {
                cli.data.map(c=>c);
                cli = cli.data.length;
            } catch {cli = 0;}

            try {
                prod.data.map(p=>p);
                prod = prod.data.length;
            } catch {prod = 0;} 

            try {
                sale.data.map(s=>s);
                sale = sale.data.length;
            } catch {sale = 0;}

            this.setState({
                cli,
                prod,
                sale,

                loading: false,
                connection: true
            })
            
        } catch{
            this.setState({loading: false, connection: false});
        }
    }

    render() {
        const {connection, loading, cli, prod, sale} = this.state;

        return (
          <Main>

            {/* Connection error */}
            {!connection && (<NoConnection/>)}
            {/* While loading */}
            {loading && (<Loader><SyncLoader/></Loader>)}

            {(!loading && connection) && (
                <div className="icons">

                    <div className="item">
                        <Link to="/clients"><MdFace className="icon" /></Link>
                        <Link to="/clients" id="clients" className="link">Clientes ({cli})</Link>
                    </div>

                    <div className="item">
                        <Link to="/products"><MdList className="icon" /></Link>
                        <Link to="/products" id="products" className="link">Produtos ({prod})</Link>
                    </div>

                    <div className="item">
                        <Link to="/sales"><MdShoppingCart className="icon" /></Link>
                        <Link to="/sales" id="sales" className="link">Vendas ({sale})</Link>
                    </div>
                </div>
            )}

          </Main>
        );
      }

}


